type Task = {
  readonly id: string;
  description: string;
  estDuration: number; // min
  priority: 1 | 2 | 3; // 1 = low, 2 = medium, 3 = high
  effortLevel: 1 | 2 | 3; // 1 = low, 2 = medium, 3 = high
  dueDate?: Date;
};

function scheduleTasks(tasks: Task[]): Task[] {
  const INTERVAL_DURATION_MINUTES = 15;
  const TOTAL_DAILY_INTERVALS = (24 * 60) / INTERVAL_DURATION_MINUTES; // 96 intervals of 15 minutes in a day
  const MAX_DAILY_EFFORT = 5;

  const prioritizedTasks = prioritizeTasks(tasks);
  const scheduledTasks: Task[] = new Array(TOTAL_DAILY_INTERVALS);

  let currentDayEffort = 0;
  let currentIntervalIndex = 0;

  while (prioritizedTasks.length > 0 && currentDayEffort < MAX_DAILY_EFFORT) {
    const availableConsecutiveIntervals = countAvailableConsecutiveIntervals(
      scheduledTasks,
      currentIntervalIndex,
    );

    for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
      const taskRequiredIntervals =
        tasks[taskIndex].estDuration / INTERVAL_DURATION_MINUTES;
      const totalEffortAfterTask =
        tasks[taskIndex].effortLevel + currentDayEffort;

      if (
        taskRequiredIntervals <= availableConsecutiveIntervals &&
        totalEffortAfterTask <= MAX_DAILY_EFFORT
      ) {
        scheduledTasks[currentIntervalIndex] = tasks[taskIndex];
        tasks.splice(taskIndex, 1);
        currentDayEffort = totalEffortAfterTask;
        currentIntervalIndex += taskRequiredIntervals;
        break;
      }
    }
  }

  return scheduledTasks;
}

function countAvailableConsecutiveIntervals(
  scheduledTasks: Task[],
  startIndex: number,
): number {
  let currentIndex = startIndex;
  for (; currentIndex < scheduledTasks.length; currentIndex++) {
    if (scheduledTasks[currentIndex]) {
      break;
    }
  }
  return currentIndex - startIndex;
}

function prioritizeTasks(tasks: Task[]): Task[] {
  return tasks.sort((a, b) => {
    // First sort by due date (soonest first)
    if (a.dueDate && b.dueDate) {
      if (a.dueDate.getTime() !== b.dueDate.getTime()) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
    } else if (a.dueDate && !b.dueDate) {
      return -1; // Task with due date comes first
    } else if (!a.dueDate && b.dueDate) {
      return 1; // Task with due date comes first
    }
    // If due dates are the same or both undefined, sort by priority (highest first: 3 > 2 > 1)
    return b.priority - a.priority;
  });
}

const testTasks: Task[] = [
  {
    id: "task-1",
    description: "Finish project proposal",
    estDuration: 120,
    priority: 3,
    effortLevel: 2,
    dueDate: new Date("2026-04-26T09:00:00"),
  },
  {
    id: "task-2",
    description: "Email client update",
    estDuration: 30,
    priority: 2,
    effortLevel: 1,
    dueDate: new Date("2026-04-26T08:00:00"),
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
    priority: 3,
    effortLevel: 3,
    dueDate: new Date("2026-04-27T10:00:00"),
  },
  {
    id: "task-5",
    description: "Code cleanup",
    estDuration: 60,
    priority: 2,
    effortLevel: 2,
  },
];

const res = scheduleTasks(testTasks);
console.log(res);
