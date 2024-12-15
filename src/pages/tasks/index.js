import React, { useEffect, useState } from "react";
//import { ref, remove, push, set } from "firebase/database";
import { remove, push, set } from "firebase/database";
import {
  database,
  getTasks,
  getClientById,
  getCaseById,
  updateTask,
} from "../../utils/firebase";
import {
  Edit2,
  Trash2,
  Copy,
  Star,
  CheckCircle,
  Phone,
  Mail,
  MessageCircle,
  Building2,
  Gavel,
  FileText,
  Hash,
} from "lucide-react";
import { useRouter } from "next/router";

const TasksPage = () => {
  const [taskDetails, setTaskDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [viewCompleted, setViewCompleted] = useState(false); // מצב להצגת משימות שהושלמו או פעילות
  const router = useRouter();

  const toggleView = () => {
    setViewCompleted(!viewCompleted); // החלפת תצוגת משימות פעילות/שהושלמו
  };

  const completeTask = async (taskId, currentStatus) => {
    try {
      // שינוי הסטטוס בין "completed" ל-"active"
      const newStatus = currentStatus === "completed" ? "active" : "completed";
  
      // עדכון הסטטוס במסד הנתונים
      await updateTask(taskId, { status: newStatus });
  
      // עדכון ה-state המקומי
      setTaskDetails((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
  
      // עדכון רשימת המשימות המסוננות
      setFilteredTasks((prevFiltered) =>
        prevFiltered.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("אירעה שגיאה בעת שינוי הסטטוס של המשימה. נסה שוב.");
    }
  };
  

   // קפונקציה לשיכפול משימה
  const duplicateTask = async (taskId) => {
    try {
      // קבלת הנתונים של המשימה המקורית
      const originalTask = taskDetails.find((task) => task.id === taskId);
  
      if (!originalTask) {
        alert("לא נמצאה המשימה לשכפול");
        return;
      }
  
      const confirmation = window.confirm(`האם אתה בטוח שברצונך לשכפל את המשימה "${originalTask.taskName}"?`);
      if (!confirmation) return;
  
      // הכנת המשימה החדשה עם נתונים זהים, אך ללא מזהה
      const newTask = { ...originalTask };
      delete newTask.id; // הסרת המזהה הקיים כדי ש-Firebase ייצור חדש
      newTask.status = "active"; // לדאוג שהסטטוס יהיה פעיל (אלא אם נדרש אחרת)
  
      // הוספת המשימה החדשה למסד הנתונים
      const newTaskRef = ref(database, "tasks");
      const newTaskKey = push(newTaskRef).key; // יצירת מזהה ייחודי חדש
      // סינון מאפיינים שאינם מוגדרים
      const filteredNewTask = Object.fromEntries(
        Object.entries(newTask).filter(([_, value]) => value !== undefined)
      );

// שמירת המשימה החדשה
await set(ref(database, `tasks/${newTaskKey}`), filteredNewTask);
  
      // עדכון ממשק המשתמש
      const updatedTasks = [...taskDetails, { id: newTaskKey, ...newTask }];
      setTaskDetails(updatedTasks);
      alert(`המשימה "${originalTask.taskName}" שוכפלה בהצלחה!`);
    } catch (error) {
      console.error("Error duplicating task:", error);
      alert("אירעה שגיאה בעת שכפול המשימה. נסה שוב.");
    }
  };
  
// ש מחיקת משימה
  const handleDeleteTask = async (taskId, taskName) => {
    const confirmation = window.confirm(
      `האם אתה בטוח שברצונך למחוק את המשימה "${taskName}"?`
    );
    if (!confirmation) return;

    try {
      const taskRef = ref(database, `tasks/${taskId}`);
      await remove(taskRef);

      setTaskDetails((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskId)
      );
      setFilteredTasks((prevFiltered) =>
        prevFiltered.filter((task) => task.id !== taskId)
      );

      alert(`המשימה "${taskName}" נמחקה בהצלחה.`);
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("אירעה שגיאה בעת מחיקת המשימה. נסה שוב.");
    }
  };

  useEffect(() => {
    const fetchTasksWithDetails = async () => {
      try {
        const data = await getTasks();
        const tasksArray = data ? Object.entries(data) : [];

        const detailsPromises = tasksArray.map(async ([id, taskData]) => {
          const clientData = taskData.clientId
            ? await getClientById(taskData.clientId)
            : null;
          const caseData = taskData.caseId
            ? await getCaseById(taskData.caseId)
            : null;

          return {
            id,
            ...taskData,
            clientName: clientData ? clientData.name : "לקוח לא נמצא",
            caseName: caseData ? caseData.caseName : "תיק לא נמצא",
            courtName: caseData ? caseData.courtName : "לא צויין",
            judgeName: caseData ? caseData.judgeName : "לא צויין",
            internalNumber: caseData ? caseData.internalNumber : "לא צויין",
            courtNumber: caseData ? caseData.courtNumber : "לא צויין",
            clientPhone: clientData ? clientData.phone : "",
            clientEmail: clientData ? clientData.email : "",
          };
        });

        const tasksWithDetails = await Promise.all(detailsPromises);

        const sortedTasks = tasksWithDetails.sort((a, b) => {
          const dateA = new Date(a.dueDate || 0);
          const dateB = new Date(b.dueDate || 0);
          return dateA - dateB;
        });

        setTaskDetails(sortedTasks);
        setFilteredTasks(sortedTasks);
      } catch (error) {
        console.error("Error fetching tasks with details:", error);
      }
    };

    fetchTasksWithDetails();
  }, []);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = taskDetails.filter((task) =>
      Object.values(task).some((value) =>
        value?.toString().toLowerCase().includes(lowerCaseSearchTerm)
      )
    );
    setFilteredTasks(filtered);
  }, [searchTerm, taskDetails]);

  const formatDate = (dateString) => {
    if (!dateString) return "לא צויין";
    const date = new Date(dateString);
    const today = new Date();

    const daysDiff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    const weeksDiff = Math.floor(daysDiff / 7);

    let dayLabel = "";
    if (daysDiff < 0) dayLabel = `עברו ${Math.abs(daysDiff)} ימים`;
    else if (daysDiff === 0) dayLabel = "היום";
    else if (daysDiff === 1) dayLabel = "מחר";
    else dayLabel = `בעוד ${daysDiff} ימים`;

    let weekLabel = "";
    if (weeksDiff === 0) weekLabel = "השבוע";
    else if (weeksDiff === 1) weekLabel = "שבוע הבא";
    else if (weeksDiff > 1) weekLabel = `עוד ${weeksDiff} שבועות`;

    return `${date.toLocaleDateString("he-IL")} ${date.toLocaleTimeString(
      "he-IL",
      { hour: "2-digit", minute: "2-digit" }
    )} (${dayLabel}) (${weekLabel})`;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-right">משימות</h1>


            <div className="fixed bottom-4 right-4 z-50">
        <Link
          href="/tasks/new"
          className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 flex items-center justify-center"
          style={{ width: "60px", height: "60px" }}
        >
          +
          </Link>
      </div>






      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="חפש משימה..."
          className="w-1/3 border border-gray-300 rounded px-3 py-2 text-right"
        />
        <button
          onClick={toggleView}
          className={`px-4 py-2 rounded ${
            viewCompleted ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
          }`}
        >
          {viewCompleted ? "משימות פעילות" : "משימות שהושלמו"}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 rtl">
        {filteredTasks
          .filter((task) => (viewCompleted ? task.status === "completed" : task.status !== "completed"))
          .map((task) => (
            <div
  key={task.id}


  
  className={`border rounded-lg shadow-md p-4 bg-white flex flex-col space-y-2 text-right ${
    task.taskName.includes("דיון") ? "border-4 border-blue-500" : "",
    task.taskName.includes("תצהיר") ? "border-4 border-orange-500" : ""
  }`}
>
  <h2 className="text-sm text-blue-600">{task.clientName}</h2>
  <p className="text-lg font-bold text-gray-800">{task.taskName}</p>
  <p className="text-sm text-gray-600">{task.caseName}</p>
  <p className="text-sm text-gray-600">{formatDate(task.dueDate)}</p>

  {/* הצגת מלבן כחול רק אם יש ערכים רלוונטיים */}
  {(task.courtName && task.courtName !== "לא צויין") ||
  (task.judgeName && task.judgeName !== "לא צויין") ||
  (task.courtNumber && task.courtNumber !== "לא צויין") ||
  (task.internalNumber && task.internalNumber !== "לא צויין") ? (
    <div className="flex items-center bg-blue-100 p-2 rounded space-x-4 rtl justify-end">
      {task.courtName && task.courtName !== "לא צויין" && (
        <span className="flex items-center text-sm text-gray-600">
          {task.courtName}
          <Building2 size={16} className="mr-1" />
        </span>
      )}
      {task.judgeName && task.judgeName !== "לא צויין" && (
        <span className="flex items-center text-sm text-gray-600">
          {task.judgeName}
          <Gavel size={16} className="mr-1" />
        </span>
      )}
      {task.courtNumber && task.courtNumber !== "לא צויין" && (
        <span className="flex items-center text-sm text-gray-600">
          {task.courtNumber}
          <FileText size={16} className="mr-1" />
        </span>
      )}
      {task.internalNumber && task.internalNumber !== "לא צויין" && (
        <span className="flex items-center text-sm text-gray-600">
          {task.internalNumber}
          <Hash size={16} className="mr-1" />
        </span>
      )}
    </div>
  ) : (
    <div className="bg-gray-100 p-2 rounded text-gray-500 text-sm text-center">
      לא צוינו פרטים נוספים
    </div>
  )}

  <div className="flex justify-between items-center mt-2">
    <div className="flex space-x-2">
      <button
        onClick={() => router.push(`/tasks/edit?taskId=${task.id}`)}
        className="text-blue-500 hover:text-blue-700"
      >
        <Edit2 size={20} />
      </button>
      <button
  onClick={() => completeTask(task.id, task.status)}
  className={`${
    task.status === "completed"
      ? "text-gray-500 hover:text-gray-700"
      : "text-green-500 hover:text-green-700"
  }`}
>
  <CheckCircle size={20} />
</button>

      <button className="text-orange-500 hover:text-orange-700">
        <Star size={20} />
      </button>
      <button
        className="text-purple-500 hover:text-purple-700"
        onClick={() => duplicateTask(task.id)}
      >
        <Copy size={20} />
      </button>
      <button
        className="text-red-500 hover:text-red-700"
        onClick={() => handleDeleteTask(task.id, task.taskName)}
      >
        <Trash2 size={20} />
      </button>
    </div>
    <div className="flex space-x-2">
      <a
        href={`tel:${task.clientPhone}`}
        className="text-green-500 hover:text-green-700"
      >
        <Phone size={20} />
      </a>
      <a
        href={`mailto:${task.clientEmail}`}
        className="text-blue-500 hover:text-blue-700"
      >
        <Mail size={20} />
      </a>
      <a
        href={
          task.clientPhone
            ? `https://wa.me/${task.clientPhone.replace(/[^0-9]/g, "")}`
            : "#"
        }
        target="_blank"
        rel="noopener noreferrer"
        className={`text-green-400 hover:text-green-600 ${
          task.clientPhone ? "" : "pointer-events-none opacity-50"
        }`}
      >
        <MessageCircle size={20} />
      </a>
    </div>
  </div>
</div>

          ))}
      </div>
    </div>
  );
};

export default TasksPage;
