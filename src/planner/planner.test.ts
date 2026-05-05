import { planDay, type Task } from "./planner";

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const now = Date.now();

function createTask(
  id: string,
  priority: Task["priority"],
  effortLevel: Task["effortLevel"],
  dueDate?: Date,
): Task {
  return {
    id,
    description: `Task ${id}`,
    estDuration: 60,
    priority,
    effortLevel,
    dueDate,
  };
}

describe("Planner Tests", () => {
  const sampleTasks: Task[] = [
    createTask("task-1", "high", 1, new Date(now + 2 * 60 * 60 * 1000)), // today
    createTask("task-2", "medium", 1, new Date(now - MS_PER_DAY)), // overdue
    createTask("task-3", "medium", 1),
    createTask("task-4", "low", 1, new Date(now + 7 * MS_PER_DAY)),
    createTask("task-5", "low", 3),
    createTask("task-6", "low", 1),
  ];

  describe("planDay", () => {
    it("should categorize tasks into mustDo, recommended, and remaining", () => {
      const plan = planDay(sampleTasks);
      expect(plan.mustDo).toHaveLength(2);
      expect(plan.recommended).toHaveLength(3);
      expect(plan.remaining).toHaveLength(1);
      expect(plan.totalEffortLevel).toBe(5);
    });

    it("should place overdue and soon tasks into mustDo", () => {
      const dueToday = createTask("today", "low", 1, new Date(now + 60 * 60 * 1000));
      const dueTomorrow = createTask("tomorrow", "low", 1, new Date(now + MS_PER_DAY + 60 * 60 * 1000));
      const later = createTask("later", "high", 1, new Date(now + 4 * MS_PER_DAY));

      const plan = planDay([dueToday, dueTomorrow, later]);
      expect(plan.mustDo.map((task) => task.id)).toEqual(["today", "tomorrow"]);
      expect(plan.recommended).toContainEqual(later);
      expect(plan.remaining).toHaveLength(0);
    });

    it("should respect effort limit", () => {
      const highEffortTasks: Task[] = [
        createTask("1", "low", 3),
        createTask("2", "low", 3),
      ];
      const plan = planDay(highEffortTasks);
      expect(plan.recommended).toHaveLength(1);
      expect(plan.totalEffortLevel).toBe(3);
    });
  });

});
