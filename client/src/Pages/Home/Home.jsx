import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { createTask, deleteTasks, getTask, reOrderTask, updateTask } from "../../Api/Api";
import Swal from "sweetalert2";

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskDate, setNewTaskDate] = useState('');

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        const data = await getTask();
        setTasks(data);
    };

    const addTask = async () => {
        if (!newTaskTitle || !newTaskDate) {
            Swal.fire("Error", "Task title and date are required!", "error");
            return;
        }
        const newTask = await createTask({
            title: newTaskTitle,
            description: newTaskDescription,
            date: newTaskDate,
            category: 'To-Do'
        });
        setTasks([...tasks, newTask]);
        setNewTaskTitle('');
        setNewTaskDescription('');
        setNewTaskDate('');
        Swal.fire("Success", "Task added successfully!", "success");
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        
        const movedTaskIndex = tasks.findIndex(task => task._id === result.draggableId);
        if (movedTaskIndex === -1) return;

        const movedTask = { ...tasks[movedTaskIndex], category: result.destination.droppableId };
        const updatedTasks = [...tasks];
        updatedTasks.splice(movedTaskIndex, 1);
        updatedTasks.splice(result.destination.index, 0, movedTask);
        
        const confirmMove = await Swal.fire({
            title: "Confirm Move",
            text: `Move this task to ${result.destination.droppableId}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, move it!"
        });

        if (confirmMove.isConfirmed) {
            setTasks(updatedTasks);
            reOrderTask(updatedTasks);
            Swal.fire("Success", "Task moved successfully!", "success");
        } else {
            setTasks([...tasks]);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to undo this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            await deleteTasks(id);
            setTasks(tasks.filter((task) => task._id !== id));
            Swal.fire("Deleted!", "Your task has been deleted.", "success");
        }
    };

    const categoryColors = {
        "To-Do": "bg-blue-200",
        "In Progress": "bg-yellow-200",
        "Done": "bg-green-200",
    };

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
                <input
                    type="date"
                    value={newTaskDate}
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    className="border p-2 rounded"
                />
                <button onClick={addTask} className="p-2 bg-blue-500 text-white rounded">Add Task</button>
            </div>

            {/* Drag-and-Drop Task Management */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {["To-Do", "In Progress", "Done"].map((category) => (
                        <Droppable key={category} droppableId={category}>
                            {(provided) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className={`p-4 rounded shadow-md ${categoryColors[category]}`}>
                                    <h2 className="text-xl font-semibold">{category}</h2>
                                    {tasks.filter((task) => task.category === category).map((task, index) => (
                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="mt-2 p-3 bg-white border rounded shadow-sm flex justify-between items-center"
                                                >
                                                    <div>
                                                        <p className="font-bold flex items-center">
                                                            {task.title} {task.category === "Done" && <span className="text-green-600 ml-2">✔️</span>}
                                                        </p>
                                                        <p className="text-gray-600 text-sm">{task.description}</p>
                                                        <p className="text-gray-500 text-xs">📅 {task.date}</p>
                                                    </div>
                                                    <button onClick={() => handleDelete(task._id)} className="text-red-500">X</button>
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
