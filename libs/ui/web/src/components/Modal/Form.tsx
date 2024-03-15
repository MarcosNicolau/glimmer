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
		<Card>
			<div className="mb-10">
				<h5 className="mb-6">{title}</h5>
				<p className="small">{description}</p>
			</div>
			<form onSubmit={onSubmit}>
				<div className="mb-8 flex flex-col items-center gap-6">{children}</div>
				<div className="flex justify-end">
					{showCancelBtn && (
						<Button variant="text" className="w-1/2" onClick={() => setOpen(false)}>
							{cancelBtnText}
						</Button>
					)}

					<Button
						isLoading={isLoading}
						disabled={disabled}
						type="submit"
						onClick={onSubmit}
						className="w-full"
					>
						{btnText}
					</Button>
				</div>
			</form>
		</Card>
	);
};
