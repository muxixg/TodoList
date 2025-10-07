package main

import (
	"Todo/db"
	"encoding/json"
	"log"
	"net/http"

	"github.com/google/uuid"
)

func main() {
	db.Init()
	http.HandleFunc("/get-all", GetList)
	http.HandleFunc("/add", AddList)
	http.HandleFunc("/move", MoveList)
	http.HandleFunc("/update", UpdateList)
	log.Println("Starting server on :8000")
	log.Fatal(http.ListenAndServe(":8000", nil))
}

// search all datas into the list
func GetList(w http.ResponseWriter, r *http.Request) {
	todos, err := db.Get()
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	log.Println("搜索成功,搜索结果如下")
	for _, t := range todos {
		log.Println(t)
	}
	json.NewEncoder(w).Encode(todos)
}

func AddList(w http.ResponseWriter, r *http.Request) {
	List := db.Todo{}
	err := json.NewDecoder(r.Body).Decode(&List)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	name, user, dscription, id := List.Name, List.User, List.Description, uuid.New().String()
	var newTodo db.Todo = db.Todo{
		ID:          id,
		User:        user,
		Name:        name,
		Description: dscription,
		Completed:   false,
	}
	err = db.Add(newTodo)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	log.Println("添加成功,成功信息是：", newTodo)
	w.WriteHeader(http.StatusOK)
}

// delete the one of data in the list with id
func MoveList(w http.ResponseWriter, r *http.Request) {
	deltodo := db.Todo{}
	err := json.NewDecoder(r.Body).Decode(&deltodo)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	id := deltodo.ID
	err = db.Move(id)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	log.Println("删除成功,删除的信息为：", deltodo)
	w.WriteHeader(http.StatusOK)
}

// change the data
func UpdateList(w http.ResponseWriter, r *http.Request) {
	todo := db.Todo{}
	err := json.NewDecoder(r.Body).Decode(&todo)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	err = db.Update(db.Todo{
		ID:          todo.ID,
		User:        todo.User,
		Name:        todo.Name,
		Description: todo.Description,
		Completed:   todo.Completed,
	})
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	log.Println("修改成功,修改的信息为：", todo)
	w.WriteHeader(http.StatusOK)
}
