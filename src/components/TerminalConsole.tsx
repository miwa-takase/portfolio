import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

type TerminalLine = {
  kind: "input" | "output" | "error";
  text: string;
};

const ROUTES: Record<string, string> = {
  top: "/",
  home: "/",
  music: "/music",
  spotify: "/music",
  mail: "/contact",
  email: "/contact",
  contact: "/contact",
  profile: "/about",
  about: "/about",
  stack: "/stack",
  stacks: "/stack",
  works: "/works",
  work: "/works",
};

const APP_NAMES = ["top", "about", "stacks", "works", "music", "contact"];
const ACTION_PREFIXES = ["open ", "go "];
const COMMANDS = Array.from(
  new Set([...Object.keys(ROUTES), "clear", "help", "ls"]),
).sort();

function normalizeCommand(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function commandTarget(command: string): string | null {
  const direct = ROUTES[command];
  if (direct) return direct;
  if (command.startsWith("open ")) {
    return ROUTES[command.slice(5)] ?? null;
  }
  if (command.startsWith("go ")) {
    return ROUTES[command.slice(3)] ?? null;
  }
  return null;
}

function commonPrefix(values: string[]): string {
  if (values.length === 0) return "";
  return values.reduce((prefix, value) => {
    let index = 0;
    while (index < prefix.length && prefix[index] === value[index]) index += 1;
    return prefix.slice(0, index);
  });
}

function completionCandidates(input: string): string[] {
  const command = input.toLowerCase().replace(/\s+/g, " ");
  if (!command.trim()) return [];

  const actionPrefix = ACTION_PREFIXES.find((prefix) =>
    command.startsWith(prefix),
  );
  if (actionPrefix) {
    const target = command.slice(actionPrefix.length);
    return APP_NAMES.filter((name) => name.startsWith(target)).map(
      (name) => `${actionPrefix}${name}`,
    );
  }

  const directCommands = COMMANDS.filter((name) => name.startsWith(command));
  const actionCommands = ACTION_PREFIXES.filter((prefix) =>
    prefix.trim().startsWith(command.trim()),
  );

  return [...directCommands, ...actionCommands].slice(0, 8);
}

export default function TerminalConsole() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([
    { kind: "output", text: "Type help to list available commands." },
  ]);

  const allowedText = useMemo(() => `open + [${APP_NAMES.join(" / ")}]`, []);
  const suggestions = useMemo(() => {
    const candidates = completionCandidates(value);
    const command = value.toLowerCase().replace(/\s+/g, " ");
    if (candidates.length === 1 && candidates[0] === command) return [];
    return candidates;
  }, [value]);

  useEffect(() => {
    const history = historyRef.current;
    if (history) history.scrollTop = history.scrollHeight;
    inputRef.current?.focus();
  }, [lines]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const raw = value.slice(0, 80);
    const command = normalizeCommand(raw);
    setValue("");

    if (!command) return;
    if (command === "clear") {
      setLines([]);
      return;
    }
    if (command === "help" || command === "ls") {
      setLines((current) => [
        ...current,
        { kind: "input", text: `$ ${command}` },
        { kind: "output", text: allowedText },
      ]);
      return;
    }
    if (!/^[a-z ]{1,80}$/.test(command)) {
      setLines((current) => [
        ...current,
        { kind: "input", text: `$ ${raw}` },
        {
          kind: "error",
          text: "Please type in English.",
        },
      ]);
      return;
    }

    const target = commandTarget(command);
    if (!target) {
      setLines((current) => [
        ...current,
        { kind: "input", text: `$ ${command}` },
        {
          kind: "error",
          text: "Command not found: Type 'help' to list available commands.",
        },
      ]);
      return;
    }

    setLines((current) => [
      ...current,
      { kind: "input", text: `$ ${command}` },
      { kind: "output", text: `Opening ${target}` },
    ]);
    window.setTimeout(() => navigate(target), 160);
  }

  function completeFromInput() {
    if (suggestions.length === 0) return;

    if (suggestions.length === 1) {
      setValue(suggestions[0]);
      return;
    }

    const prefix = commonPrefix(suggestions);
    if (prefix.length > value.length) setValue(prefix);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Tab") return;

    event.preventDefault();
    completeFromInput();
  }

  return (
    <div className="utility-frame terminal-console font-mono text-sm text-white">
      <div
        className="terminal-history space-y-1.5"
        aria-live="polite"
        ref={historyRef}
      >
        {lines.map((line, index) => (
          <p
            key={`${line.kind}-${index}`}
            className={line.kind === "error" ? "terminal-error" : "text-white"}
          >
            {line.text}
          </p>
        ))}
      </div>
      <form
        className="terminal-entry mt-4"
        onSubmit={submit}
      >
        <div className="terminal-prompt flex items-center gap-2">
          <span aria-hidden="true" className="text-white">
            $
          </span>
          <input
            aria-label="Terminal command"
            autoComplete="off"
            autoCapitalize="none"
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-white outline-none placeholder:text-white/50"
            maxLength={80}
            placeholder="open works"
            ref={inputRef}
            spellCheck={false}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        {suggestions.length > 0 ? (
          <div
            aria-label="Command suggestions"
            className="terminal-suggestions"
            role="listbox"
          >
            {suggestions.map((suggestion) => (
              <button
                className="terminal-suggestion"
                key={suggestion}
                onClick={() => {
                  setValue(suggestion);
                  inputRef.current?.focus();
                }}
                type="button"
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}
      </form>
    </div>
  );
}
