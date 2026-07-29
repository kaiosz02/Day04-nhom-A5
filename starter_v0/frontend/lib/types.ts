export type Role = "user" | "assistant";

export interface ChatMessage {
  role: Role;
  content: string;
}

export interface ToolCallRecord {
  name: string;
  args: Record<string, unknown>;
}

export interface ToolEvent {
  tool: string;
  args?: Record<string, unknown>;
  result?: Record<string, unknown> & { error?: string; message?: string; awaiting_user?: boolean };
}

export interface RoundRecord {
  round: number;
  assistant_text: string | null;
  tool_calls: ToolCallRecord[];
  tool_results: ToolEvent[];
}

export interface ChatResponse {
  status: "answered" | "waiting_for_user" | "max_tool_rounds";
  assistant_text: string;
  rounds: RoundRecord[];
  tool_events: ToolEvent[];
  artifact_version: string;
  transcript_file: string;
}

export interface TurnDisplay {
  id: string;
  user: string;
  response?: ChatResponse;
  pending?: boolean;
  error?: string;
}

export interface ToolDeclaration {
  name: string;
  description?: string;
  parameters?: Record<string, unknown>;
}

export interface RunSummary {
  file: string;
  version: string;
  artifact_version: string;
  provider: string;
  model: string;
  suite: string;
  summary: {
    total_cases?: number;
    measured_cases?: number;
    provider_error_cases?: number;
    case_accuracy?: number;
    tool_routing_accuracy?: number;
    argument_accuracy?: number;
    multiturn_accuracy?: number;
  };
}