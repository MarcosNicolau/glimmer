type Props = React.PropsWithChildren<{
	leftComponent: React.ReactNode;
	rightComponent: React.ReactNode;
}>;

export const ThreeColumnLayout: React.FC<Props> = ({ leftComponent, rightComponent, children }) => {
	return (
		<div>
			<aside>
				<div>{leftComponent}</div>
			</aside>
			{children}
			<aside>
				<div>{rightComponent}</div>
			</aside>
		</div>
	);
};
