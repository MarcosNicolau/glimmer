"use client";

import { Card } from "../Card";
import { Button } from "../Buttons";
import { Dispatch, SetStateAction } from "react";
import clsx from "clsx";

type Props = {
	title: string;
	description: string;
	setOpen: Dispatch<SetStateAction<boolean>>;
	showCancelBtn?: boolean;
	btnText: string;
	cancelBtnText?: string;
	children?: React.ReactNode;
	onSubmit: () => void;
	disabled?: boolean;
	isLoading?: boolean;
	classNames?: { container?: string };
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
	classNames,
	children,
}) => {
	return (
		<Card className={clsx("p-9", classNames?.container)}>
			<div className="mb-10 px-1">
				<h5 className="mb-6">{title}</h5>
				<p className="small">{description}</p>
			</div>
			<form onSubmit={onSubmit}>
				<div className="mb-8 flex max-h-[400px] flex-col items-center gap-6 overflow-auto p-1">
					{children}
				</div>
				<div className="flex justify-end gap-2">
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
