# Adaptive Daily Planner

## Overview

This project is a personal productivity system designed to help users plan realistic, manageable days without overwhelm.

Instead of maximizing productivity or enforcing strict schedules, the system focuses on helping users answer:

> "What is a realistic set of things I can actually complete today?"

The goal is to reduce overplanning, underplanning, and decision fatigue by generating a structured daily plan from a simple list of tasks.

---

## Core Problem

Most people struggle with:

- Overplanning → creating unrealistic schedules they cannot follow
- Underplanning → not knowing what to focus on
- Decision fatigue → constantly deciding what to do next
- Inconsistent energy and motivation levels throughout the day
- Feeling guilt or failure when plans are not completed

This project aims to solve that by creating a lightweight planning engine that adapts to constraints like time, energy, and task effort.

---

## Core Idea

Users input a list of tasks with simple attributes such as:

- priority (high / medium / low)
- estimated duration
- optional metadata (later expansion)

The system then generates a structured daily plan:

- Must Do → the most important and realistic tasks for the day
- Good To Do → secondary tasks if time/energy allows
- Optional → extra tasks that can be done if everything else is complete

The focus is on realism, not optimization.

---

## Current Stage (MVP v0.1)

The project is currently in its earliest stage.

At this stage:

- There is basic UI with task input and list components
- There is no database
- There is no backend server
- There is no AI integration

Instead, the system is implemented as a TypeScript-based planner engine that runs in a terminal environment, with a Next.js frontend for basic task management.

### Current flow:

1. A static list of tasks is defined
2. A planner function processes tasks
3. Tasks are sorted and grouped into:
   - Must Do
   - Good To Do
   - Optional

4. The resulting plan is printed to the terminal

This allows rapid iteration on the core logic before building a user interface.

---

## Architecture (Current Thinking)

The system is designed in layers:

### 1. Planner Engine (Core Logic)

Responsible for:

- sorting tasks
- applying priority rules
- deciding workload distribution
- generating daily structure

This is the most important part of the system.

### 2. Data Layer (Future)

Will eventually include:

- database storage (PostgreSQL)
- persistent tasks and history
- user profiles

### 3. API Layer (Future)

Will expose planner functionality to:

- web app
- mobile app
- external integrations

### 4. UI Layer (Current)

Built using Next.js:

- task input interface (TaskForm component)
- task list display (TaskList component)
- basic task addition (AddTask component)
- daily plan visualization (planned)

---

## Future Vision

The long-term goal is to evolve this into a full adaptive planning system that:

- learns user behavior over time
- adjusts planning based on energy and workload patterns
- integrates optional AI assistance for planning suggestions
- supports both web and mobile interfaces

Potential future extensions include:

- machine learning-based planning optimization (Python service)
- calendar integration
- productivity pattern analysis
- personalized planning styles (structured vs flexible users)

---

## Key Design Principles

- Simplicity first — avoid overengineering early
- Realism over optimization — plans should be achievable, not maximal
- Adaptability — system should adjust to user constraints
- Minimal user input — reduce friction in planning
- Incremental complexity — add intelligence only when core logic is stable

---

## Current Tech Stack

- TypeScript
- Next.js (React framework)
- Tailwind CSS (styling)
- Node.js (for running planner locally)
- No database yet (planned: PostgreSQL + Prisma)
- No AI yet (planned future integration)

---

## Why This Exists

This project is both:

- a personal productivity tool
- a systems design exploration
- a foundation for future intelligent planning systems

The goal is to build something that helps with daily structure without becoming overwhelming or rigid.
