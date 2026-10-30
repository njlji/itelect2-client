function TaskList({ tasks }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className="task-item">
          <span>{task.title}</span>
          <span>{task.dueDate}</span>
        </li>
      ))}
    </ul>
  )
}

export default TaskList
