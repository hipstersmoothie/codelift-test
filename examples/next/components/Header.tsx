import { useRouter } from "next/router";
import { FunctionComponent } from "react";

const greetings = ["hello", "saluton", "hei", "bonjour", "guten tag", "aloha"];

type HeaderProps = { title: string };

export const Header: FunctionComponent<HeaderProps> = ({ title }) => {
  const router = useRouter();
  const { path = [] } = router.query;
  const [greeting] = path as string[];
  const next = greetings[(greetings.indexOf(greeting) + 1) % greetings.length];

  return (
    <div className="bg-black text-white text-center text-5xl shadow-lg py-12">
      <h1 className="tracking-wider">
        <a href={`/${next}`}>
          {greeting && (
            <strong className="capitalize">{greeting},&nbsp;</strong>
          )}
          {title}
        </a>
      </h1>
    </div>
  );
};

Header["Inspector"] = ({ props, setProps }) => {
  return (
    <label className="flex flex-col px-4">
      <small className="opacity-75 italic tracking-wider">Title</small>
      <input
        autoFocus
        className="bg-transparent border-b border-dotted"
        onChange={event => setProps({ title: event.target.value })}
        value={props.title}
      />
    </label>
  );
};
