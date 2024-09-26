/* eslint-disable react/prop-types */
import { useMemo } from "react";

export default function StatusIndicator({ status }) {
  const handleStatusCheck = useMemo(() => {
    switch (status) {
      case "Ongoing":
        return (
          <div className="w-2 h-2 rounded-full m-0 flex-shrink-0 bg-[#aaff00]"></div>
        );
      case "Completed":
        return (
          <div className="w-2 h-2 rounded-full m-0 flex-shrink-0 bg-[#00aaff]"></div>
        );
      case "Cancelled":
        return (
          <div className="w-2 h-2 rounded-full m-0 flex-shrink-0 bg-[#ff0000]"></div>
        );
      case "Not yet aired":
        return (
          <div className="w-2 h-2 rounded-full m-0 flex-shrink-0 bg-[#ffa500]"></div>
        );
      default:
        return (
          <div className="w-2 h-2 rounded-full m-0 flex-shrink-0 bg-[#808080]"></div>
        );
    }
  }, [status]);
  return <>{handleStatusCheck}</>;
}
