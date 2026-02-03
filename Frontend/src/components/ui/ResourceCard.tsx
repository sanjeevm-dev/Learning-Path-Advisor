import {
  BookOpen,
  Video,
  MonitorPlay,
  GraduationCap,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { Resource } from "../../types/types";

interface ResourceCardProps {
  resource: Resource;
  compact?: boolean;
}

const TYPE_ICONS = {
  Article: BookOpen,
  Video: Video,
  Tutorial: MonitorPlay,
  Course: GraduationCap,
};

const DIFFICULTY_COLORS = {
  Beginner: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  Intermediate: "bg-blue-100 text-blue-700 border border-blue-200",
  Advanced: "bg-orange-100 text-orange-700 border border-orange-200",
};

export function ResourceCard({ resource, compact = false }: ResourceCardProps) {
  const Icon = TYPE_ICONS[resource.resourceType] || BookOpen;

  return (
    <Link to={`/resources/${resource.id}`} className="block h-full">
      <div
        className={`h-full flex flex-col overflow-hidden border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-lg hover:border-blue-400 transition-all duration-300 group cursor-pointer`}
      >
        {/* Header */}
        <div className={`${compact ? "p-4" : "p-6 pb-3"}`}>
          <div className="flex justify-between items-start gap-4">
            <div className="flex gap-2 mb-2">
              <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-normal rounded bg-gray-100 text-gray-800">
                <Icon className="w-3 h-3" />
                {resource.resourceType}
              </span>
              <span
                className={`flex items-center gap-1 px-2 py-0.5 text-xs font-normal rounded ${DIFFICULTY_COLORS[resource.difficulty]}`}
              >
                {resource.difficulty}
              </span>
            </div>
          </div>
          <h3
            className={`font-bold leading-tight transition-colors group-hover:text-blue-600 ${compact ? "text-lg" : "text-xl"}`}
          >
            {resource.title}
          </h3>
        </div>

        {/* Content */}
        <div className={`${compact ? "px-4 py-0" : "px-6 py-2"} flex-grow`}>
          <p className="text-gray-500 text-sm line-clamp-3">
            {resource.description}
          </p>
        </div>

        {/* Footer */}
        <div
          className={`${compact ? "p-4" : "p-6"} flex justify-between items-center text-sm text-gray-500 border-t bg-gray-50`}
        >
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{resource.estimatedMinutes} min</span>
          </div>
          <div className="flex items-center gap-1 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0 duration-300 font-medium text-xs">
            View Details <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </Link>
  );
}
