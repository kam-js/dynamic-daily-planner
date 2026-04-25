interface Props {
  tasks: string[];
}

const TaskList = ({ tasks }: Props) => {
  return (
    <>
      <h1>TaskList</h1>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
    </>
  );
};

export default TaskList;
