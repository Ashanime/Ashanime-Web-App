import { Switch } from "@headlessui/react";

interface props {
  handleToggle: (toggle: boolean) => void;
  dub: boolean;
}

export default function ToggleDub({ handleToggle, dub }: props) {
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <Switch.Group as="div" className="flex items-center mr-5">
      <Switch
        checked={dub}
        onChange={handleToggle}
        className={classNames(
          dub ? "bg-redor" : "bg-white",
          "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring--500"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            dub ? "translate-x-5 bg-white" : "bg-redor translate-x-0",
            "pointer-events-none inline-block h-5 w-5 rounded-full  shadow transform ring-1 transition ease-in-out duration-200"
          )}
        />
      </Switch>
      <Switch.Label as="span" className="ml-3">
        <span className="outfit-light text-white">
          Dub: {dub ? "yes" : "no"}
        </span>
      </Switch.Label>
    </Switch.Group>
  );
}
