"use client";

import { Card } from "../Card";
import { Button } from "../Buttons";
import { Dispatch, SetStateAction } from "react";

type Props = {
	title: string;
	description: string;
	setOpen: Dispatch<SetStateAction<boolean>>;
	showCloseBtn?: boolean;
	showCancelBtn?: boolean;
	btnText: string;
	cancelBtnText: string;
	children?: React.ReactNode;
	onSubmit: () => void;
	disabled?: boolean;
	isLoading?: boolean;
};

export const ModalForm: React.FC<Props> = ({
	description,
	setOpen,
	title,
	btnText,
	cancelBtnText,
	showCancelBtn = true,
	onSubmit,
	disabled = false,
	isLoading,
	children,
}) => {
	return (
		<Card className="min-w-[600px]">
			<div className="mb-8">
				<h5 className="mb-6">{title}</h5>
				<p>{description}</p>
			</div>
			<form onSubmit={onSubmit}>
				<div className="flex flex-col items-center gap-6  mb-8">{children}</div>
				<div className="flex">
					{showCancelBtn && (
						<Button variant="text" className="w-1/2" onClick={() => setOpen(false)}>
							{cancelBtnText}
						</Button>
					)}
					<Button
						isLoading={isLoading}
						disabled={disabled}
						className="w-full"
						type="submit"
						onClick={onSubmit}
					>
						{btnText}
					</Button>
				</div>
			</form>
		</Card>
	);
};
