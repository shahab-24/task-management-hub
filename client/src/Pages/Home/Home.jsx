import { useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTasks,
  createTasks,
  deleteTasks,
  reorderTasks,
  logActivity,
  getActivityLogs,
} from "../../Api/Api.js";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Swal from "sweetalert2";
import {
  FaTasks,
  FaSpinner,
  FaCheckCircle,
  FaSun,
  FaMoon,
  FaTrash,
} from "react-icons/fa";

import { AuthContext } from "../../Providers/AuthProvider.jsx";

function Home() {
        const [taskCounts, setTaskCounts] = useState({
                toDo: 0,
                inProgress: 0,
                done: 0,
              });
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
  const { data: activities = [] } = useQuery({
    queryKey: ["activities"],
    queryFn: getActivityLogs,
  });

//   const taskCounts = {
//     toDo: tasks.filter((task) => task.category === "To-Do").length,
//     inProgress: tasks.filter((task) => task.category === "In Progress").length,
//     done: tasks.filter((task) => task.category === "Done").length,
//   };

  useEffect(() => {
        setTaskCounts({
          toDo: tasks.filter((task) => task.category === "To-Do").length,
          inProgress: tasks.filter((task) => task.category === "In Progress").length,
          done: tasks.filter((task) => task.category === "Done").length,
        });
      }, [tasks]);
      

  const addTaskMutation = useMutation({
    mutationFn: createTasks,
    onSuccess: (newTask) => {
      queryClient.invalidateQueries(["tasks"]);
      logActivityMutation.mutate(`Task "${newTask.title}" added`);
      setNewTaskTitle("");
      setNewTaskDesc("");
      setNewTaskDueDate("");
      Swal.fire("Success", "Task added successfully!", "success");
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTasks,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(["tasks"]);
      logActivityMutation.mutate(`Task deleted`);
      Swal.fire("Deleted!", "Your task has been deleted.", "success");
    },
  });

  const reorderTaskMutation = useMutation({
    mutationFn: reorderTasks,
    onMutate: async ({ taskId, newCategory, newIndex }) => {
      await queryClient.cancelQueries(["tasks"]);

      const previousTasks = queryClient.getQueryData(["tasks"]);

      // Optimistically update the cache
      queryClient.setQueryData(["tasks"], (oldTasks) => {
        return oldTasks.map((task) => {
          if (task._id === taskId) {
            return { ...task, category: newCategory, order: newIndex };
          }
          return task;
        });
      });

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // Revert UI if mutation fails
      queryClient.setQueryData(["tasks"], context.previousTasks);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]); // Refetch tasks from server
    },
  });

  const logActivityMutation = useMutation({
    mutationFn: logActivity,
    onSuccess: () => queryClient.invalidateQueries(["activities"]),
  });

  const addTask = () => {
    if (!newTaskTitle.trim()) {
      return Swal.fire("Error", "Task title is required!", "error");
    }
    addTaskMutation.mutate({
      title: newTaskTitle,
      description: newTaskDesc,
      category: "To-Do",
      dueDate: newTaskDueDate,
      email: user?.email,
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTaskMutation.mutate(id);
      }
    });
  };

  //     const handleDragEnd = (result) => {
  //         if (!result.destination) return;
  //         const movedTask = tasks[result.source.index];
  //         reorderTaskMutation.mutate({ taskId: movedTask._id, newCategory: result.destination.droppableId, newIndex: result.destination.index });
  //         logActivityMutation.mutate(`Task "${movedTask.title}" moved to ${result.destination.droppableId}`);
  //     };

  const handleDragEnd = (result) => {
        if (!result.destination) return;
      
        const { source, destination, draggableId } = result;
      
        if (
          source.droppableId !== destination.droppableId ||
          source.index !== destination.index
        ) {
          const taskId = draggableId;
          const newCategory = destination.droppableId;
          const newIndex = destination.index;
      
          reorderTaskMutation.mutate(
            { taskId, newCategory, newIndex },
            {
              onSuccess: () => {
                queryClient.invalidateQueries(["tasks"]);
              },
              onMutate: () => {
                setTaskCounts((prevCounts) => {
                  const updatedCounts = { ...prevCounts };
                  updatedCounts[source.droppableId]--;
                  updatedCounts[newCategory]++;
                  return updatedCounts;
                });
              },
            }
          );
      
          logActivityMutation.mutate(`Task moved to ${newCategory}`);
        }
      };
      

  return (
    <div
      className={`p-6 max-w-4xl mx-auto ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      {/* <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded"
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button> */}
      <h1 className="text-2xl font-bold text-center">Task Manager</h1>

      <div className="flex gap-2 my-4">
        <span className="text-blue-500">
          <FaTasks /> {taskCounts.toDo} To-Do
        </span>
        <span className="text-yellow-500">
          <FaSpinner /> {taskCounts.inProgress} In Progress
        </span>
        <span className="text-green-500">
          <FaCheckCircle /> {taskCounts.done} Done
        </span>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <input
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Task Title..."
          className="border p-2 flex-1 rounded"
        />
        <input
          value={newTaskDesc}
          onChange={(e) => setNewTaskDesc(e.target.value)}
          placeholder="Description..."
          className="border p-2 flex-1 rounded"
        />
        <input
          type="date"
          value={newTaskDueDate}
          onChange={(e) => setNewTaskDueDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={addTask}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Add
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {["To-Do", "In Progress", "Done"].map((category) => (
          <Droppable key={category} droppableId={category}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="p-4 bg-gray-100 rounded shadow-md"
              >
                <h2 className="text-xl font-semibold">{category}</h2>
                {tasks
                  .filter((task) => task.category === category)
                  .map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mt-2 p-3 border rounded flex justify-between bg-white"
                        >
                          <p className="font-bold">{task.title}</p>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="text-red-500"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>

      <div className="mt-8 p-4 bg-gray-200 rounded shadow-md">
        <h2 className="text-xl font-semibold">Activity Log</h2>
        <ul className="mt-2 space-y-2">
          {activities
            .slice(-5)
            .reverse()
            .map((activity, index) => (
              <li key={index} className="text-sm">
                {new Date(activity.timestamp).toLocaleTimeString()} -{" "}
                {activity.message}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
