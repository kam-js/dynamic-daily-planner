export type PriorityLevel = "low" | "medium" | "high";

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
  readonly mustDo: Task[];
  readonly recommended: Task[];
  readonly remaining: Task[];
  readonly totalEffortLevel: number;
};

const PRIORITY_BASE = {
  low: 8,
  medium: 20,
  high: 50,
} as const;

export function planDay(tasks: Task[]): DailyPlan {
  const MAX_DAILY_EFFORT = 5;

  const prioritizedTasks = prioritizeTasks(tasks);
  const mustDo: Task[] = [];
  const recommended: Task[] = [];
  const remaining: Task[] = [];
  let totalEffortLevel = 0;

  for (const task of prioritizedTasks) {
    if (isTaskDueSoon(task)) {
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

function prioritizeTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => computeTaskScore(b) - computeTaskScore(a));
}

function computeTaskScore(task: Task): number {
  const score = PRIORITY_BASE[task.priority];

  if (!task.dueDate) {
    return score;
  }

  const daysLeft = getDaysUntilDue(task.dueDate);
  return applyUrgencyMultiplier(score, daysLeft);
}

function getDaysUntilDue(dueDate: Date): number {
  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  return (dueDate.getTime() - Date.now()) / MILLISECONDS_PER_DAY;
}

function isTaskDueSoon(task: Task): boolean {
  const MUST_DO_DAYS_LEFT_THRESHOLD = 2;
  return (
    task.dueDate !== undefined &&
    getDaysUntilDue(task.dueDate) < MUST_DO_DAYS_LEFT_THRESHOLD
  );
}

function applyUrgencyMultiplier(baseScore: number, daysLeft: number): number {
  const SCORE_MULTIPLIER_TOMORROW = 50;
  const SCORE_MULTIPLIER_TODAY = 60;
  const SCORE_MULTIPLIER_FUTURE_BASE = 15;
  const SCORE_MULTIPLIER_FUTURE_EXPONENT = 1.4;
  const SCORE_MULTIPLIER_OVERDUE_BASE = 12;
  const SCORE_MULTIPLIER_OVERDUE_DECAY = 5;
  const SCORE_MULTIPLIER_OVERDUE_DECAY_RATE = 7;

  if (daysLeft >= 2) {
    return (
      baseScore *
      (SCORE_MULTIPLIER_FUTURE_BASE / (daysLeft + 1)) **
        SCORE_MULTIPLIER_FUTURE_EXPONENT
    );
  }

  if (daysLeft >= 1) {
    return baseScore * SCORE_MULTIPLIER_TOMORROW;
  }

  if (daysLeft >= 0) {
    return baseScore * SCORE_MULTIPLIER_TODAY;
  }

  return (
    baseScore *
    (SCORE_MULTIPLIER_OVERDUE_BASE +
      SCORE_MULTIPLIER_OVERDUE_DECAY *
        (1 -
          Math.E **
            (-Math.abs(daysLeft) / SCORE_MULTIPLIER_OVERDUE_DECAY_RATE)))
  );
}
