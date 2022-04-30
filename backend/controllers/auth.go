package controllers

import (
	"APIGOLANGMAP/model"
	"APIGOLANGMAP/services"
	"net/http"

	"github.com/dgrijalva/jwt-go"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func LoginHandler(c *gin.Context) {
	var creds model.User
	var usr model.User

	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "Bad request!"})
		return
	}
	services.Db.Find(&usr, "username = ?", creds.Username)
	if usr.Username == "" || !CheckPasswordHash(creds.Password, usr.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"status": http.StatusUnauthorized, "message": "Invalid User!"})
		return
	}

	token := services.GenerateTokenJWT(usr)

	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": http.StatusUnauthorized, "message": "Access denied!"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "Success!", "token": token, "User": usr})
}

func RegisterHandler(c *gin.Context) {
	var creds model.User

	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "Bad request!"})
		return
	}
	hash, _ := HashPassword(creds.Password)

	creds.Password = hash
	result := services.Db.Save(&creds)
	if result.RowsAffected != 0 {
		c.JSON(http.StatusCreated, gin.H{"status": http.StatusOK, "message": "Success!", "User ID": creds.ID, "Username": creds.Username})
		return
	}
	c.JSON(http.StatusNotAcceptable, gin.H{"status": http.StatusNotAcceptable, "message": "Cannot be created!"})
}

func RefreshHandler(c *gin.Context) {
	var usr model.User

	services.Db.Find(&usr, "username = ?", c.GetString("username"))

	if usr.Username == "" || !InvalidateToken(c) {
		c.JSON(http.StatusNotAcceptable, gin.H{"status": http.StatusNotAcceptable, "message": "Cannot be created!"})
		return
	}

	token := services.GenerateTokenJWT(usr)
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"status": http.StatusUnauthorized, "message": "Acesso não autorizado"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": http.StatusNoContent, "message": "Token atualizado com sucesso!", "token": token})
}

func LogoutHandler(c *gin.Context) {
	var usr model.User

	services.Db.Find(&usr, "username = ?", c.GetString("username"))

	if InvalidateToken(c) {
		c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "message": "Success!"})
		return
	}
	c.JSON(http.StatusNotAcceptable, gin.H{"status": http.StatusNotAcceptable, "message": "Cannot be created!"})
}

func InvalidateToken(c *gin.Context) bool {
	token := services.InvalidateTokenJWT(c)
	if token == "" {
		return true
	}
	revoked := model.RevokedToken{
		Token: token,
	}
	result := services.Db.Save(&revoked)
	return result.RowsAffected != 0
}

func UserFromToken(c *gin.Context) {

	if !services.ValidateTokenJWT(c) {
		c.JSON(http.StatusUnauthorized, gin.H{"status": http.StatusUnauthorized, "message": "Not authorized"})
		return
	}
	var JwtKey = services.GetSecretKey()
	var tokenInput, _, _ = services.GetAuthorizationToken(c)
	var user model.User
	token, err := jwt.ParseWithClaims(tokenInput, &model.Claims{}, func(token *jwt.Token) (interface{}, error) {
		return JwtKey, nil
	})

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"status": http.StatusUnauthorized, "message": "Not authorized"})
		return
	}

	if claims, ok := token.Claims.(*model.Claims); ok && token.Valid {
		user.ID = claims.UserID
		services.Db.Find(&user)
		c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "user": user})
		return
	}
	c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"status": http.StatusBadRequest, "message": "Invalid request"})

}
