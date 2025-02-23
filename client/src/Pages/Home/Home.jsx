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
import { FaTasks, FaSpinner, FaCheckCircle, FaTrash } from "react-icons/fa";
import { AuthContext } from "../../Providers/AuthProvider.jsx";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Shared/Loader.jsx";

function Home() {
  // All hooks are declared unconditionally at the top.
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();

//   const {
//     data: tasks = [],
//     isLoading: tasksLoading,
//     isError: tasksError,
//     error: tasksErrorMessage,
//   } = useQuery({
//     queryKey: ["tasks"],
//     queryFn: getTasks,
//   });

const {
        data: tasks = [],
        isLoading: tasksLoading,
        isError: tasksError,
        error: tasksErrorMessage,
      } = useQuery({
        queryKey: ["tasks", user?.email], // Pass user email as dependency
        queryFn: () => getTasks(user?.email), // Call API with email
      });
      

  const {
    data: activities = [],
    isLoading: activitiesLoading,
    isError: activitiesError,
    error: activitiesErrorMessage,
  } = useQuery({
    queryKey: ["activities"],
    queryFn: getActivityLogs,
  });

  useEffect(() => {
        if (tasks.length) {
          setTaskCounts({
            toDo: tasks.filter((task) => task.category === "To-Do").length,
            inProgress: tasks.filter((task) => task.category === "In Progress").length,
            done: tasks.filter((task) => task.category === "Done").length,
          });
        }
      }, [tasks]); // Ensure it only runs when `tasks` changes
      

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
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      logActivityMutation.mutate(`Task deleted`);
      Swal.fire("Deleted!", "Your task has been deleted.", "success");
    },
  });

  const reorderTaskMutation = useMutation({
        mutationFn: reorderTasks,
        onMutate: async (updatedTasks) => {
          await queryClient.cancelQueries(["tasks"]);
          const previousTasks = queryClient.getQueryData(["tasks"]);
      
          queryClient.setQueryData(["tasks"], updatedTasks);
      
          return { previousTasks };
        },
        onError: (err, variables, context) => {
          queryClient.setQueryData(["tasks"], context.previousTasks);
        },
        onSuccess: () => {
          queryClient.invalidateQueries(["tasks"]);
        },
      });


      const onDragEnd = (result) => {
        if (!result.destination) return;
      
        const { source, destination, draggableId } = result;
      
        if (source.droppableId !== destination.droppableId || source.index !== destination.index) {
          const taskId = draggableId.toString(); // ✅ Convert to string
          const newCategory = destination.droppableId;
          const newIndex = destination.index;
      
          console.log("🔄 Moving task:", { taskId, newCategory, newIndex });
      
          reorderTaskMutation.mutate({ taskId, newCategory, newIndex });

          logActivityMutation.mutate(`Task moved to ${newCategory}`);
        }
      };
      
      
      
      
//   const logActivityMutation = useMutation({
//     mutationFn: logActivity,
//     onSuccess: () => queryClient.invalidateQueries(["activities"]),
//   });

  const logActivityMutation = useMutation({
        mutationFn: logActivity,
        onSuccess: () => {
          queryClient.invalidateQueries(["activities"]); // ✅ Refresh logs after activity is logged
        },
      });
      

  // Instead of early returns, compute flags.
  const isLoading = tasksLoading || activitiesLoading;
  const hasError = tasksError || activitiesError;

  // Prepare the content to render.
  let content;

  if (isLoading) {
    content = (
      <div className="flex items-center justify-center h-screen">
        <Loader></Loader>
      </div>
    );
  } else if (hasError) {
    content = (
      <div className="p-6">
        {tasksError && (
          <div>
            <h3 className="text-2xl font-bold">Error loading tasks:</h3>
            <p>{tasksErrorMessage.message}</p>
          </div>
        )}
        {activitiesError && (
          <div>
            <h3 className="text-2xl font-bold">Error loading activities:</h3>
            <p>{activitiesErrorMessage.message}</p>
          </div>
        )}
      </div>
    );
  } else {
    // Main UI content when data is ready.
    content = (
      <div
        className={`p-6 max-w-4xl mx-auto ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
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
            onClick={() => {
              if (!user) {
                Swal.fire({
                  title: "Authentication Required",
                  text: "You need to log in to add tasks. Redirecting to login page...",
                  icon: "warning",
                  timer: 2000,
                  showConfirmButton: false,
                }).then(() => {
                  navigate("/login");
                });
                return;
              }
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
            }}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Add
          </button>
        </div>

        {/* <DragDropContext
          onDragEnd={(result) => {
            if (!result.destination) return;
            if (!user) {
              Swal.fire({
                title: "Authentication Required",
                text: "You need to log in to update tasks. Redirecting to login page...",
                icon: "warning",
                timer: 2000,
                showConfirmButton: false,
              }).then(() => {
                navigate("/login");
              });
              return;
            }
            const { source, destination, draggableId } = result;
            if (
              source.droppableId !== destination.droppableId ||
              source.index !== destination.index
            ) {
              const taskId = draggableId;
              const newCategory = destination.droppableId;
              const newIndex = destination.index;
              reorderTaskMutation.mutate({ taskId, newCategory, newIndex });
              logActivityMutation.mutate(`Task moved to ${newCategory}`);
            }
          }}
        >
          {["To-Do", "In Progress", "Done"].map((category) => (
            <Droppable key={category} droppableId={category}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="p-4 bg-gray-100 rounded shadow-md my-4"
                >
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
                            className="mt-2 p-3 border rounded flex justify-between bg-white"
                          >
                            <p className="font-bold">{task.title}</p>
                            <button
                              onClick={() => {
                                if (!user) {
                                  Swal.fire({
                                    title: "Authentication Required",
                                    text: "You need to log in to delete tasks. Redirecting to login page...",
                                    icon: "warning",
                                    timer: 2000,
                                    showConfirmButton: false,
                                  }).then(() => {
                                    navigate("/login");
                                  });
                                  return;
                                }
                                Swal.fire({
                                  title: "Are you sure?",
                                  text: "This action cannot be undone!",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonText: "Yes, delete it!",
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    deleteTaskMutation.mutate(task._id);
                                  }
                                });
                              }}
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
        </DragDropContext> */}

        <DragDropContext
  onDragEnd={(onDragEnd) => {
    if (!onDragEnd.destination) return;
    if (!user) {
      Swal.fire({
        title: "Authentication Required",
        text: "You need to log in to update tasks. Redirecting to login page...",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate("/login");
      });
      return;
    }
    const { source, destination, draggableId } = onDragEnd;

    if (
      source.droppableId !== destination.droppableId ||
      source.index !== destination.index
    ) {
      const taskId = draggableId;
      const newCategory = destination.droppableId;
      const newIndex = destination.index;
      reorderTaskMutation.mutate({ taskId, newCategory, newIndex });
      logActivityMutation.mutate(`Task moved to ${newCategory}`);
    }
  }}
>
  {["To-Do", "In Progress", "Done"].map((category) => (
    <Droppable key={category} droppableId={category}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="p-4 bg-gray-100 rounded shadow-md my-4"
        >
          <h2 className="text-xl font-semibold">{category}</h2>

          {tasks
            .filter((task) => task.category === category)
            .map((task, index) => {
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

              return (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="mt-2 p-3 border rounded flex flex-col bg-white shadow-md relative"
                    >
                      {/* Show Red Line for Overdue Tasks */}
                      {isOverdue && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                      )}

                      <p className="font-bold">{task.title}</p>
                      <p className="text-sm text-gray-600">{task.description}</p>

                      {/* Show Due Date with Red Text if Overdue */}
                      <p className={`text-xs font-semibold ${isOverdue ? "text-red-500" : "text-green-600"}`}>
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>

                      <button
                        onClick={() => {
                          if (!user) {
                            Swal.fire({
                              title: "Authentication Required",
                              text: "You need to log in to delete tasks. Redirecting to login page...",
                              icon: "warning",
                              timer: 2000,
                              showConfirmButton: false,
                            }).then(() => {
                              navigate("/login");
                            });
                            return;
                          }
                          Swal.fire({
                            title: "Are you sure?",
                            text: "This action cannot be undone!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Yes, delete it!",
                          }).then((result) => {
                            if (result.isConfirmed) {
                              deleteTaskMutation.mutate(task._id);
                            }
                          });
                        }}
                        className="text-red-500 mt-2 self-end"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </Draggable>
              );
            })}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  ))}
</DragDropContext>


        <div className="mt-8 p-4 bg-gray-200 rounded shadow-md">
          <h2 className="text-xl font-semibold">Activity Log</h2>
          <ul className="mt-2 space-y-2">
            {activities.slice(-5).reverse().map((activity, index) => (
              <li key={index} className="text-sm">
                {new Date(activity.timestamp).toLocaleTimeString()} - {activity.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Always return a container (or fragment) so the hook order remains consistent.
  return <>{content}</>;
}

export default Home;
