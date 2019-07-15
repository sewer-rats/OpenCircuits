package web

import (
	"encoding/json"
	"github.com/OpenCircuits/OpenCircuits/site/go/auth"
	"github.com/gin-gonic/contrib/sessions"
	"github.com/gin-gonic/gin"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
)

type Item struct {
	Id    string `json:"id"`
	Label string `json:"label"`
	Icon  string `json:"icon"`
	Not   bool   `json:"not"`
}

type Section struct {
	Id    string `json:"id"`
	Label string `json:"label"`
	Items []Item `json:"items"`
}

type NavConfig struct {
	Sections []Section `json:"sections"`
}

var navConfig NavConfig

func init() {
	// Load the sections from the json file TODO: don't cache this (or make a way to make it dirty)
	file, err := ioutil.ReadFile("./data/itemnavconfig.json")
	if err != nil {
		log.Printf("File error: %v\n", err)
		os.Exit(1)
	}
	err = json.Unmarshal(file, &navConfig)
	if err != nil {
		log.Printf("Failed to unmarshall json: %v\n", err)
		os.Exit(1)
	}
}

func getLastModifiedTime(path string) time.Time {
	file, err := os.Stat(path)
	if err != nil {
		log.Printf("Invalid file path %s\n", path)
		return time.Now()
	}
	return file.ModTime()
}

func getBustedName(path string) string {
	return path + "?ver=" + strconv.FormatInt(getLastModifiedTime(path).Unix(), 10)
}

func indexHandler(c *gin.Context, manager auth.AuthenticationManager) {
	session := sessions.Default(c)
	userId := session.Get("user-id")
	loggedIn := userId != nil

	authData := struct {
		Headers []template.HTML
		Buttons []template.HTML
	}{}
	for _, a := range manager.AuthMethods {
		authData.Headers = append(authData.Headers, a.GetLoginHeader())
		authData.Buttons = append(authData.Buttons, a.GetLoginButton())
	}

	c.HTML(http.StatusOK, "index.tmpl", gin.H{"navConfig": navConfig, "l": loggedIn, "userId": userId, "authData": authData,
		"bundleJs": getBustedName("./Bundle.js")})
}

func noCacheHandler(path string) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.File(path)
	}
}
