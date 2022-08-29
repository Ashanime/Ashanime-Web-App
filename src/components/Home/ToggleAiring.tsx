import { Switch } from "@headlessui/react";
import { useAppDispatch } from "../../redux/store";
import { useEffect, useState } from "react";
import { setStatus } from "../../redux/filter-slice";

interface props {
  paginate?: (page: number) => void;
}

export default function ToggleAiring({ paginate }: props) {
  const [airing, setAiring] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const toggleAiring = () => {
    setAiring(!airing);
  };

  useEffect(() => {
    if (airing) {
      dispatch(setStatus({ value: "RELEASING", name: "Releasing" }));
    } else if (!airing) {
      dispatch(setStatus({ value: "FINISHED", name: "Finished" }));
    }

    if (paginate) {
      paginate(1);
    }
  }, [airing, dispatch]);

  return (
    <Switch.Group as="div" className="flex items-center mr-5">
      <Switch
        checked={airing}
        onChange={toggleAiring}
        className={classNames(
          airing ? "bg-redor" : "bg-white",
          "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring--500"
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            airing ? "translate-x-5 bg-white" : "bg-redor translate-x-0",
            "pointer-events-none inline-block h-5 w-5 rounded-full  shadow transform ring-1 transition ease-in-out duration-200"
          )}
        />
      </Switch>
      <Switch.Label as="span" className="ml-3 z-10">
        <span className="outfit-light text-white">
          Airing only: {airing ? "yes" : "no"}
        </span>
      </Switch.Label>
    </Switch.Group>
  );
}
