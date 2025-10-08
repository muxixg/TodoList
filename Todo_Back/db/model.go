package db

import (
	"Todo/config"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// 全局变量
var dsn string = config.Getdsn()

// 结构体
type Todo struct { //List的结构体
	ID          string `json:"id"`
	User        string `json:"user"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Completed   bool   `json:"completed"`
}

// 方法
func (Todo) TableName() string {
	return "test"
}
func connectSql() (db *gorm.DB) {
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("fail connect to sql")
	}
	return
}

func Init() {
	db := connectSql()
	db.AutoMigrate(&Todo{})
}

// resolve the func(GetList) in main
func Get() ([]Todo, error) {
	db := connectSql()
	var todos []Todo
	result := db.Find(&todos)
	return todos, result.Error
}

func Add(newTodo Todo) error {
	db := connectSql()
	result := db.Create(&newTodo)
	return result.Error
}

// resolve the func(Move) in main
func Move(id string) error {
	db := connectSql()
	result := db.Delete(&Todo{}, "id=?", id)
	return result.Error
}

// resolve the func(Update) in main
func Update(todo Todo) error {
	db := connectSql()
	result := db.Save(todo)
	return result.Error
}
