import {
  planDay,
  prioritizeTasks,
  computeTaskScore,
  getDaysUntilDue,
  type Task,
} from "./planner";

describe("Planner Tests", () => {
  const sampleTasks: Task[] = [
    {
      id: "task-1",
      description: "Finish project proposal",
      estDuration: 120,
      priority: 3,
      effortLevel: 2,
      dueDate: new Date("2026-05-05T09:00:00"),
    },
    {
      id: "task-2",
      description: "Email client update",
      estDuration: 30,
      priority: 2,
      effortLevel: 1,
      dueDate: new Date("2026-04-30T08:00:00"), // Due today
    },
    {
      id: "task-3",
      description: "Prepare meeting notes",
      estDuration: 45,
      priority: 1,
      effortLevel: 1,
    },
    {
      id: "task-4",
      description: "Design review",
      estDuration: 90,
      priority: 2,
      effortLevel: 3,
      dueDate: new Date("2026-06-27T10:00:00"),
    },
    {
      id: "task-5",
      description: "Code cleanup",
      estDuration: 60,
      priority: 2,
      effortLevel: 2,
    },
  ];

  describe("computeTaskScore", () => {
    it("should calculate score based on priority only if no due date", () => {
      const task: Task = {
        id: "1",
        description: "Test",
        estDuration: 60,
        priority: 2,
        effortLevel: 1,
      };
      expect(computeTaskScore(task)).toBe(20); // 2 * 10
    });

    it("should add urgency bonus for due dates", () => {
      const overdueTask: Task = {
        id: "1",
        description: "Overdue",
        estDuration: 60,
        priority: 1,
        effortLevel: 1,
        dueDate: new Date(Date.now() - 86400000), // Yesterday
      };
      expect(computeTaskScore(overdueTask)).toBe(40); // 10 + 30

      const dueSoonTask: Task = {
        id: "2",
        description: "Due soon",
        estDuration: 60,
        priority: 1,
        effortLevel: 1,
        dueDate: new Date(Date.now() + 2 * 86400000), // In 2 days
      };
      expect(computeTaskScore(dueSoonTask)).toBe(25); // 10 + 15
    });
  });

  describe("getDaysUntilDue", () => {
    it("should calculate days until due date", () => {
      const futureDate = new Date(Date.now() + 3 * 86400000); // 3 days from now
      expect(getDaysUntilDue(futureDate)).toBeCloseTo(3, 1);
    });
  });

  describe("prioritizeTasks", () => {
    it("should sort tasks by score descending", () => {
      const tasks: Task[] = [
        {
          id: "low",
          description: "Low",
          estDuration: 60,
          priority: 1,
          effortLevel: 1,
        },
        {
          id: "high",
          description: "High",
          estDuration: 60,
          priority: 3,
          effortLevel: 1,
        },
      ];
      const prioritized = prioritizeTasks(tasks);
      expect(prioritized[0].id).toBe("high");
      expect(prioritized[1].id).toBe("low");
    });

    it("should not mutate original array", () => {
      const original = [...sampleTasks];
      prioritizeTasks(sampleTasks);
      expect(sampleTasks).toEqual(original);
    });
  });

  describe("planDay", () => {
    it("should categorize tasks into mustDo, recommended, and remaining", () => {
      const plan = planDay(sampleTasks);
      expect(plan.mustDo).toHaveLength(2); // task-2 (due today) and task-1 (high priority)
      expect(plan.recommended).toHaveLength(1); // task-5
      expect(plan.remaining).toHaveLength(2); // task-4 and task-3
      expect(plan.totalEffortLevel).toBe(5);
    });

    it("should respect effort limit", () => {
      const highEffortTasks: Task[] = [
        {
          id: "1",
          description: "High effort",
          estDuration: 60,
          priority: 1,
          effortLevel: 3,
        },
        {
          id: "2",
          description: "Another high effort",
          estDuration: 60,
          priority: 1,
          effortLevel: 3,
        },
      ];
      const plan = planDay(highEffortTasks);
      expect(plan.recommended).toHaveLength(1); // Only the first one fits
      expect(plan.totalEffortLevel).toBe(3);
    });
  });
});
