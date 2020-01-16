const express = require('express');
const router = express.Router();

const initialTodos = []
const fileName = 'todos.json';
const fs = require('fs').promises;

const store = {
    async read() {
        try {
            await fs.access(fileName);
            this.todos = JSON.parse((await fs.readFile(fileName)).toString());

        }
        catch (e) {
            this.todos = initialTodos;
        }
        return this.todos
    }, // End of read

    async save() {
        await fs.writeFile(fileName, JSON.stringify(this.todos));
    },// End of save

    async getIndexById(id) {
        try {
            const todos = await this.read();
            return todos.findIndex(todo => todo.id === +id);
        }
        catch (e) {
            console.log(e);
        }
    },// End of getIndexById

    async getNextTodoId() {
        let maxId = 0;
        const todos = await this.read();
        todos.forEach(todo => {
            if (todo.id > maxId) maxId = todo.id;
        });
        return maxId + 1
    },// End of getIndexById
    todos: []
}// End of getNextTodoId



/* GET todos page. */
router.get('/', function (req, res, next) {
    res.json(store.read());
});

/* Post todos page. */
router.post('/', async (req, res, next) => {
    const todo = req.body;
    todo.id = await store.getNextTodoId();
    store.todos.push(todo);
    await store.save();
    res.json('ok');
});

/* Put todos page. */
router.put('/:id', async (req, res, next) => {
    const id = req.params.id;
    const index = await store.getIndexById(id)
    const { title, completed } = req.body
    store.todos[index].title = title;
    store.todos[index].completed = completed;
    await store.save()
    res.json('ok');
});

/* Delete todos page. */
router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    const index = await store.getIndexById(id)
    store.todos.splice(index,1);
    await store.save()
    res.json('ok');
});

module.exports = router;
