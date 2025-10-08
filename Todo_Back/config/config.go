package config

import (
	"fmt"
	"log"
	"os"

	"gopkg.in/yaml.v3"
)

type Config struct {
	Serverdata ServerConfig `yaml:"serverdatas"`
	Sqldata    SqlConfig    `yaml:"sqldatas"`
}
type SqlConfig struct { //SQL的信息
	Host     string `yaml:"host"`
	Port     string `yaml:"port"`
	User     string `yaml:"user"`
	Password string `yaml:"password"`
}

type ServerConfig struct {
	Host string `yaml:"host"`
	Port string `yaml:"port"`
}

func Getdsn() (dsn string) {
	//file := Openfile("config.yaml")
	file, err := os.Open("config.yaml")
	if err != nil {
		log.Println(err)
		return
	}
	defer file.Close()
	decoder := yaml.NewDecoder(file)
	var Config Config
	err = decoder.Decode(&Config)
	if err != nil {
		log.Println("Error decoding YAML:", err)
	}
	//dsn = Config.Sqldata.User + ":" + Config.Sqldata.Password + "@tcp(" + Config.Sqldata.Host + ":" + Config.Sqldata.Port + ")/test?charset=utf8mb4&parseTime=True&loc=Local"
	dsn = fmt.Sprintf("%s:%s@tcp(%s:%s)/test?charset=utf8mb4&parseTime=True&loc=Local",
		Config.Sqldata.User,
		Config.Sqldata.Password,
		Config.Sqldata.Host,
		Config.Sqldata.Port,
	)
	//log.Println(Config)
	//log.Println(dsn)
	return
}
