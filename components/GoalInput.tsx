import { useState } from "react";
import { useSession } from "next-auth/react";
import { useStore } from "@/store";
import { useModal } from "@/utils/modal";
import { api } from "@/utils/api";
import { Goal } from "@prisma/client";
import { useForm } from "react-hook-form";

interface GoalInputProps {
  goal?: Goal;
  onClose: () => void;
}

const GoalInput: React.FC<GoalInputProps> = ({ goal, onClose }) => {
  const { data: session } = useSession();
  const store = useStore();
  const { showModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Goal>({
    defaultValues: goal || {
      name: "",
      target: "",
      deadline: new Date(),
    },
  });

  const onSubmit = async (data: Goal) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/goals", data);

      if (response.status === 201) {
        store.addGoal(response.data);
        reset();
        onClose();
      } else {
        setError("Failed to create goal");
      }
    } catch (error) {
      console.error("Error creating goal:", error);
      setError("Failed to create goal");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {goal ? "Edit Goal" : "Create Goal"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
              Goal Name
            </label>
            <input
              type="text"
              id="name"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.name ? "border-red-500" : ""
              }`}
              {...register("name", {
                required: "Goal name is required",
                maxLength: {
                  value: 50,
                  message: "Goal name cannot exceed 50 characters",
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="target" className="block text-gray-700 font-bold mb-2">
              Target
            </label>
            <input
              type="text"
              id="target"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.target ? "border-red-500" : ""
              }`}
              {...register("target", {
                required: "Target is required",
              })}
            />
            {errors.target && (
              <p className="text-red-500 text-xs italic">
                {errors.target.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="deadline"
              className="block text-gray-700 font-bold mb-2"
            >
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.deadline ? "border-red-500" : ""
              }`}
              {...register("deadline", {
                required: "Deadline is required",
              })}
            />
            {errors.deadline && (
              <p className="text-red-500 text-xs italic">
                {errors.deadline.message}
              </p>
            )}
          </div>
          {error && (
            <p className="text-red-500 text-xs italic">{error}</p>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Save Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalInput;