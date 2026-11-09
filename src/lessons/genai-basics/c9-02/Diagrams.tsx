// Code-drawn diagrams for c9-02. Text is real SVG text, so it scales with the
// page on a phone and follows the light and dark theme tokens.

const arrowId = (name: string) => `c9-02-arrow-${name}`;

function Arrowhead({ name }: { name: string }) {
  return (
    <marker
      id={arrowId(name)}
      viewBox="0 0 10 10"
      refX="9"
      refY="5"
      markerWidth="7"
      markerHeight="7"
      orient="auto-start-reverse"
    >
      <path d="M0 0 L10 5 L0 10 z" fill="var(--muted)" />
    </marker>
  );
}

export function WorkflowDiagram() {
  return (
    <svg
      role="img"
      aria-labelledby="c9-02-workflow-title"
      viewBox="0 0 400 320"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="c9-02-workflow-title">
        Three boxes stacked from top to bottom, labelled Classify ticket, Check
        urgency and Route ticket. Arrows point down from one box to the next.
      </title>
      <defs>
        <Arrowhead name="workflow" />
      </defs>
      {[
        { y: 16, label: "Classify ticket" },
        { y: 128, label: "Check urgency" },
        { y: 240, label: "Route ticket" },
      ].map((box) => (
        <g key={box.label}>
          <rect
            x="90"
            y={box.y}
            width="220"
            height="60"
            rx="10"
            fill="var(--panel)"
            stroke="var(--ink)"
            strokeWidth="2"
          />
          <text
            x="200"
            y={box.y + 38}
            textAnchor="middle"
            fontSize="22"
            fontWeight="600"
            fill="var(--ink)"
          >
            {box.label}
          </text>
        </g>
      ))}
      <line
        x1="200"
        y1="76"
        x2="200"
        y2="124"
        stroke="var(--muted)"
        strokeWidth="2"
        markerEnd={`url(#${arrowId("workflow")})`}
      />
      <line
        x1="200"
        y1="188"
        x2="200"
        y2="236"
        stroke="var(--muted)"
        strokeWidth="2"
        markerEnd={`url(#${arrowId("workflow")})`}
      />
    </svg>
  );
}

export function AgentLoopDiagram() {
  return (
    <svg
      role="img"
      aria-labelledby="c9-02-loop-title"
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="c9-02-loop-title">
        Three boxes in a loop. The top box, Model picks next step, has an arrow
        to Run a tool at the bottom right. Run a tool has an arrow to Model
        reads result at the bottom left. From Model reads result, an arrow goes
        back up to the top box, and another goes down to a Stop box that ends
        the loop.
      </title>
      <defs>
        <Arrowhead name="loop" />
      </defs>
      <rect
        x="125"
        y="10"
        width="150"
        height="70"
        rx="10"
        fill="var(--panel)"
        stroke="var(--ink)"
        strokeWidth="2"
      />
      <text
        x="200"
        y="40"
        textAnchor="middle"
        fontSize="19"
        fontWeight="600"
        fill="var(--ink)"
      >
        Model picks
      </text>
      <text
        x="200"
        y="64"
        textAnchor="middle"
        fontSize="19"
        fontWeight="600"
        fill="var(--ink)"
      >
        next step
      </text>
      <rect
        x="225"
        y="255"
        width="150"
        height="70"
        rx="10"
        fill="var(--panel)"
        stroke="var(--ink)"
        strokeWidth="2"
      />
      <text
        x="300"
        y="296"
        textAnchor="middle"
        fontSize="19"
        fontWeight="600"
        fill="var(--ink)"
      >
        Run a tool
      </text>
      <rect
        x="25"
        y="255"
        width="150"
        height="70"
        rx="10"
        fill="var(--panel)"
        stroke="var(--ink)"
        strokeWidth="2"
      />
      <text
        x="100"
        y="285"
        textAnchor="middle"
        fontSize="19"
        fontWeight="600"
        fill="var(--ink)"
      >
        Model reads
      </text>
      <text
        x="100"
        y="309"
        textAnchor="middle"
        fontSize="19"
        fontWeight="600"
        fill="var(--ink)"
      >
        result
      </text>
      <line
        x1="100"
        y1="325"
        x2="100"
        y2="344"
        stroke="var(--muted)"
        strokeWidth="2"
        markerEnd={`url(#${arrowId("loop")})`}
      />
      <rect
        x="25"
        y="346"
        width="150"
        height="40"
        rx="10"
        fill="var(--panel)"
        stroke="var(--muted)"
        strokeWidth="2"
        strokeDasharray="6 5"
      />
      <text
        x="100"
        y="373"
        textAnchor="middle"
        fontSize="19"
        fontWeight="600"
        fill="var(--ink)"
      >
        Stop
      </text>
      <line
        x1="256"
        y1="80"
        x2="290"
        y2="250"
        stroke="var(--muted)"
        strokeWidth="2"
        markerEnd={`url(#${arrowId("loop")})`}
      />
      <line
        x1="222"
        y1="290"
        x2="180"
        y2="290"
        stroke="var(--muted)"
        strokeWidth="2"
        markerEnd={`url(#${arrowId("loop")})`}
      />
      <line
        x1="100"
        y1="250"
        x2="150"
        y2="82"
        stroke="var(--muted)"
        strokeWidth="2"
        markerEnd={`url(#${arrowId("loop")})`}
      />
    </svg>
  );
}

export function CombinedDiagram() {
  return (
    <svg
      role="img"
      aria-labelledby="c9-02-combined-title"
      viewBox="0 0 400 320"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="c9-02-combined-title">
        Three boxes stacked from top to bottom, labelled Intake, Investigate and
        File ticket, with arrows pointing down. The Investigate box has a dashed
        outline to mark it as the open-ended step; the other two are fixed.
      </title>
      <defs>
        <Arrowhead name="combined" />
      </defs>
      {[
        { y: 16, label: "Intake", dashed: false },
        { y: 128, label: "Investigate", dashed: true },
        { y: 240, label: "File ticket", dashed: false },
      ].map((box) => (
        <g key={box.label}>
          <rect
            x="90"
            y={box.y}
            width="220"
            height="60"
            rx="10"
            fill="var(--panel)"
            stroke={box.dashed ? "var(--accent)" : "var(--ink)"}
            strokeWidth="2"
            strokeDasharray={box.dashed ? "9 6" : undefined}
          />
          <text
            x="200"
            y={box.y + 38}
            textAnchor="middle"
            fontSize="22"
            fontWeight="600"
            fill="var(--ink)"
          >
            {box.label}
          </text>
        </g>
      ))}
      <line
        x1="200"
        y1="76"
        x2="200"
        y2="124"
        stroke="var(--muted)"
        strokeWidth="2"
        markerEnd={`url(#${arrowId("combined")})`}
      />
      <line
        x1="200"
        y1="188"
        x2="200"
        y2="236"
        stroke="var(--muted)"
        strokeWidth="2"
        markerEnd={`url(#${arrowId("combined")})`}
      />
    </svg>
  );
}
