"use client";

import { Card } from "apps/dostoevsky/src/ui/Card";
import { IconBtn } from "apps/dostoevsky/src/ui/btns/Icon";
import { Button } from "apps/dostoevsky/src/ui/btns/btn";
import { CrossIcon } from "apps/dostoevsky/src/ui/icons";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";

type Props = {
	title: string;
	description: string;
	setOpen: Dispatch<SetStateAction<boolean>>;
	showCloseBtn?: boolean;
	showCancelBtn?: boolean;
	btnText?: string;
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
	showCancelBtn = true,
	showCloseBtn = true,
	onSubmit,
	disabled = false,
	isLoading,
	children,
}) => {
	const t = useTranslations();
	return (
		<Card>
			{showCloseBtn && (
				<div className="absolute right-5 top-5 cursor-pointer">
					<IconBtn icon={CrossIcon} onClick={() => setOpen(false)} />
				</div>
			)}
			<div className="mb-8">
				<h5 className="mb-6">{title}</h5>
				<p>{description}</p>
			</div>
			<form onSubmit={onSubmit}>
				<div className="flex flex-col items-center gap-6  mb-8">{children}</div>
				<div className="flex">
					{showCancelBtn && (
						<Button variant="text" className="w-1/2" onClick={() => setOpen(false)}>
							{t("forms.cancel-btn")}
						</Button>
					)}
					<Button
						isLoading={isLoading}
						disabled={disabled}
						className="w-full"
						type="submit"
						onClick={onSubmit}
					>
						{btnText || t("forms.submit-btn")}
					</Button>
				</div>
			</form>
		</Card>
	);
};
