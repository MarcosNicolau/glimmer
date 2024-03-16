type Props = {
	tag: string;
};

export const Tag: React.FC<Props> = ({ tag }) => (
	<div className="bg-contrast-300 flex items-center rounded px-2 py-[4px]">
		<p className="text-text-100 text-xs leading-none"># {tag}</p>
	</div>
);
