import ChapterCourse from "./ChapterCourse";
export default function CourseChapterP1() {
  return (
    <ChapterCourse
      copy={{
        chapterId: "P1",
        module: "python-for-ai",
        icon: "{ }",
        eyebrow: "Python for AI / Chapter P1",
        subtitle: "From primitive types to working with data and AI APIs.",
        callout:
          "Code is how ideas become systems. This chapter builds the practical Python foundations needed to configure models, process data, and parse AI responses.",
        asideTitle: "Practical foundations for AI",
        outcomes: [
          "Store, inspect, and convert core Python data types.",
          "Format prompts and model parameters safely.",
          "Catch parsing errors when handling structured outputs.",
        ],
        startHref: "/learn/python-for-ai/p1-01",
      }}
    />
  );
}
