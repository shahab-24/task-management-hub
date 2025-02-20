import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { createTask, getTask } from "../../Api/Api";
import Swal from "sweetalert2";


const Home = () => {
        const [tasks, setTasks] = useState([])
        const [newTaskTitle, setNewTaskTitle] = useState('')
        const [newTaskDescription, setNewTaskDescription] = useState('')

        useEffect(() => {
                loadTasks()
        },[])

        const loadTasks = async() => {
                const data = await getTask()
                setTasks(data)
        }

        const addTask = async () => {
                console.log('task added')
                const newTask = await createTask({title: newTaskTitle, description: newTaskDescription, category: 'To-Do'})
                setTasks([...tasks, newTask])
                setNewTaskTitle('')
                setNewTaskDescription('')

                Swal.fire("Success", "Task added successfully!", "success");

        }

        const handleDragEnd = () => {
                console.log('drag')
        }

        const handleDelete = () => {
                console.log('delete')
        }



        return (
                <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-center">Task Manager</h1>
          
                {/* Add Task Form */}
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Task Title..."
                    className="border p-2 flex-1 rounded"
                  />
                  <input
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Task Description..."
                    className="border p-2 flex-1 rounded"
                  />
                  <button onClick={addTask} className="p-2 bg-blue-500 text-white rounded">Add Task</button>
                </div>
          
                {/* Drag-and-Drop Task Management */}
                <DragDropContext onDragEnd={handleDragEnd}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {["To-Do", "In Progress", "Done"].map((category) => (
                      <Droppable key={category} droppableId={category}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps} className="p-4 bg-gray-100 rounded shadow-md">
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
                                      className="mt-2 p-3 bg-white border rounded shadow-sm"
                                    >
                                      <div className="flex justify-between">
                                        <div>
                                          <p className="font-bold">{task.title}</p>
                                          <p className="text-gray-600 text-sm">{task.description}</p>
                                        </div>
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