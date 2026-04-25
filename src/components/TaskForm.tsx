import Form from "next/form";

interface Props {
  onSubmit: (data: FormData) => void;
}

const TaskForm = ({ onSubmit }: Props) => {
  return (
    <Form action={onSubmit}>
      <input name="task" />
      <button type="submit">Add Task</button>
    </Form>
  );
};

export default TaskForm;
