export type PriorityLevel = 1 | 2 | 3;

export type EffortLevel = 1 | 2 | 3;

export type Task = {
  readonly id: string;
  description: string;
  estDuration: number; // minutes
  priority: PriorityLevel;
  effortLevel: EffortLevel;
  dueDate?: Date;
};

export type DailyPlan = {
  mustDo: Task[];
  recommended: Task[];
  remaining: Task[];
  totalEffortLevel: number;
};

const MAX_DAILY_EFFORT = 5;
const MUST_DO_SCORE_THRESHOLD = 30;
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

export function planDay(tasks: Task[]): DailyPlan {
  const prioritizedTasks = prioritizeTasks(tasks);
  const mustDo: Task[] = [];
  const recommended: Task[] = [];
  const remaining: Task[] = [];
  let totalEffortLevel = 0;

  for (const task of prioritizedTasks) {
    if (computeTaskScore(task) > MUST_DO_SCORE_THRESHOLD) {
      mustDo.push(task);
      totalEffortLevel += task.effortLevel;
      continue;
    }

    const totalEffortAfterTask = totalEffortLevel + task.effortLevel;
    if (totalEffortAfterTask <= MAX_DAILY_EFFORT) {
      recommended.push(task);
      totalEffortLevel = totalEffortAfterTask;
    } else {
      remaining.push(task);
    }
  }

  return {
    mustDo,
    recommended,
    remaining,
    totalEffortLevel,
  };
}

export function prioritizeTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => computeTaskScore(b) - computeTaskScore(a));
}

export function computeTaskScore(task: Task): number {
  let score = task.priority * 10;

  if (!task.dueDate) {
    return score;
  }

  const daysLeft = getDaysUntilDue(task.dueDate);

  if (daysLeft < 1) {
    score += 30; // due today or overdue
  } else if (daysLeft < 4) {
    score += 15; // due in the next few days
  } else if (daysLeft < 7) {
    score += 8; // due within a week
  }

  return score;
}

export function getDaysUntilDue(dueDate: Date): number {
  return (dueDate.getTime() - Date.now()) / MILLISECONDS_PER_DAY;
}
const testTasks: Task[] = [
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
    dueDate: new Date("2026-04-30T08:00:00"),
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

const res = planDay(testTasks);
console.log(res);
