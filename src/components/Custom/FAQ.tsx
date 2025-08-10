import {
  BadgeDollarSign,
  Route,
  ShieldCheck,
  Truck,
  Undo2,
  UserRoundCheck,
} from "lucide-react";

const faq = [
  {
    icon: Undo2,
    question: "What is Task Viesta?",
    answer:
      "Task Viesta is a Kanban-style task management tool where you can manage all your tasks and perform CRUD operations easily. It is simple, mobile-responsive, and comes with multiple themes.",
  },
  {
    icon: Route,
    question: "Does Task Viesta support drag and drop?",
    answer:
      "Yes, Task Viesta includes drag and drop features that let you move tasks between columns smoothly for a seamless workflow.",
  },
  {
    icon: Truck,
    question: "Is Task Viesta mobile-friendly?",
    answer:
      "Absolutely! Task Viesta is designed to be fully responsive and works perfectly on mobile devices and desktops alike.",
  },
  {
    icon: BadgeDollarSign,
    question: "Can I customize the look of Task Viesta?",
    answer:
      "Yes, Task Viesta supports multiple themes so you can switch between light and dark modes or other theme options for a sleek and modern design.",
  },
  {
    icon: ShieldCheck,
    question: "What types of operations can I perform on tasks?",
    answer:
      "You can Create, Read, Update, and Delete (CRUD) tasks effortlessly within each Kanban column, helping you manage your workflow efficiently.",
  },
  {
    icon: UserRoundCheck,
    question: "Is Task Viesta easy to use for beginners?",
    answer:
      "Yes, Task Viesta offers a clean, intuitive interface with modern design principles that make task management straightforward even for new users.",
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 mt-10 mb-24">
      <div className="max-w-screen-lg">
        <h2 className="text-4xl md:text-5xl !leading-[1.15] font-bold tracking-tight text-center">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 text-lg text-center text-muted-foreground">
          Quick answers to common questions about our products and services.
        </p>

        <div className="mt-12 grid md:grid-cols-2 rounded-xl gap-4">
          {faq.map(({ question, answer, icon: Icon }) => (
            <div key={question} className="border p-6 rounded-xl">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-accent">
                <Icon />
              </div>
              <div className="mt-5 mb-2 flex items-start gap-2 text-[1.35rem] font-semibold tracking-tight">
                <span>{question}</span>
              </div>
              <p>{answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
