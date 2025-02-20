import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { createTask } from "../../Api/Api";


const Home = () => {
        const [tasks, setTasks] = useState([])
        const [newTaskTitle, setNewTaskTitle] = useState('')

        const addTask = async () => {
                const newTask = await createTask({title: newTaskTitle, category: 'To-Do'})
                setTasks([...tasks, newTask])
                setNewTaskTitle('')

        }

        const handleDragEnd = () => {
                console.log('drag')
        }

        const handleDelete = () => {
                console.log('delete')
        }



        return (
                <div className="p-6">
      <h1 className="text-2xl font-bold">Task Manager</h1>
      <input
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        placeholder="Enter new task..."
        className="border p-2"
      />
      <button onClick={addTask} className="ml-2 p-2 bg-blue-500 text-white">Add Task</button>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {["To-Do", "In Progress", "Done"].map((category) => (
            <Droppable key={category} droppableId={category}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="p-4 bg-gray-100 min-h-[200px]">
                  <h2 className="text-xl font-semibold">{category}</h2>
                  {tasks
                    .filter((task) => task.category === category)
                    .map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mt-2 p-2 bg-white border rounded"
                          >
                            <div className="flex justify-between">
                              <span>{task.title}</span>
                              <button onClick={() => handleDelete(task._id)} className="text-red-500">X</button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
        );
};

export default Home;