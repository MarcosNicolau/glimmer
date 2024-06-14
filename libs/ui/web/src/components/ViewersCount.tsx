import { FilledCircleIcon } from "libs/ui/web/src/components/Icons";

type Props = {
	number: string | number;
};

export const ViewersCount: React.FC<Props> = ({ number }) => (
	<div className="flex items-end justify-center gap-2">
		<p className="small text-text-100 font-bold">{number}</p>
		<FilledCircleIcon className="fill-red h-[21px] w-[12px]" />
	</div>
);
