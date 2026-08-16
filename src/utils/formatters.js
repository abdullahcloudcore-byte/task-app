// Utility formatters for dates, statuses, and Laravel error parsing

export const formatDate = (dateString) => {
  if (!dateString) return "No date";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(date);
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }).format(date);
  } catch {
    return dateString;
  }
};

export const getStatusBadgeConfig = (status) => {
  switch (status) {
    case "completed":
      return {
        label: "Completed",
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
        dot: "bg-emerald-500"
      };
    case "in_progress":
      return {
        label: "In Progress",
        bg: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800",
        dot: "bg-sky-500"
      };
    case "pending":
    default:
      return {
        label: "Pending",
        bg: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
        dot: "bg-amber-500"
      };
  }
};

export const getPriorityBadgeConfig = (priority) => {
  switch (priority) {
    case "high":
      return {
        label: "High Priority",
        bg: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
        iconColor: "text-rose-500"
      };
    case "medium":
      return {
        label: "Medium Priority",
        bg: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
        iconColor: "text-amber-500"
      };
    case "low":
    default:
      return {
        label: "Low Priority",
        bg: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
        iconColor: "text-slate-500"
      };
  }
};

/**
 * Extracts human-readable errors from Laravel API response
 * Laravel returns: { message: "The given data was invalid.", errors: { email: ["The email has already been taken."] } }
 */
export const extractLaravelErrorMessage = (error, defaultMessage = "An unexpected error occurred.") => {
  if (!error) return defaultMessage;
  
  if (typeof error === "string") return error;
  
  // Axios response object
  const responseData = error.response?.data || error;
  
  if (responseData?.errors && typeof responseData.errors === "object") {
    const errorList = Object.values(responseData.errors).flat();
    if (errorList.length > 0) {
      return errorList[0];
    }
  }
  
  if (responseData?.message) {
    return responseData.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return defaultMessage;
};
