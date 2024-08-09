"use client";

import { useState, useTransition } from "react";

import { Todo } from "@prisma/client";
import { useRouter } from "next/navigation";

import styles from "./TodoItem.module.css";
import { IoCheckboxOutline, IoSquareOutline } from "react-icons/io5";

interface Props {
  todo: Todo;
  // TODO: Acciones que quiero llamar
  toggleTodo: (id: string, complete: boolean) => Promise<Todo | void>;
}

export const TodoItem = ({ todo, toggleTodo }: Props) => {
  const router = useRouter();
  const [isFetching, setIsFetching] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isCompleteOptimistic =
    isFetching || isPending ? !todo.complete : todo.complete;

  const onToggleTodo = async () => {
    setIsFetching(true);
    await toggleTodo(todo.id, !todo.complete);
    setIsFetching(false);

    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div
      className={isCompleteOptimistic ? styles.todoDone : styles.todoPending}
    >
      <div className="flex flex-col sm:flex-row justify-start items-center gap-4">
        <div
          onClick={() => onToggleTodo()}
          className={`
            flex p-2 rounded-md cursor-pointer
            hover:bg-opacity-60
            ${isCompleteOptimistic ? "bg-blue-100" : "bg-red-100"}
          `}
        >
          {isCompleteOptimistic ? (
            <IoCheckboxOutline size={30} />
          ) : (
            <IoSquareOutline size={30} />
          )}
        </div>

        <div className="text-center sm:text-left">{todo.description}</div>
      </div>
    </div>
  );
};
