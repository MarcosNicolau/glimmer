import { IncomingActionsPayload } from "@glimmer/bulgakov";
import { useComponentDimensions, useModal } from "@glimmer/hooks";
import { LiteralUnion } from "@glimmer/types";
import { Button, CrossIcon, Input, Modal, ModalForm, Select } from "@glimmer/ui/web";
import { ROUTES } from "apps/dostoevsky/src/libs/constants";
import { useSocketStore, useToastsStore } from "apps/dostoevsky/src/state";
import { useTranslations } from "next-intl";
import { useRouter } from "apps/dostoevsky/src/libs/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Props = Omit<ReturnType<typeof useModal>, "toggleOpen">;

type FormData = IncomingActionsPayload["@room:create"];

export const CreateRoomFormModal: React.FC<Props> = ({ open, setOpen }) => {
	const { register, handleSubmit, formState, watch, setValue, reset } = useForm<FormData>({
		defaultValues: {
			description: "",
			isPrivate: false,
			name: "",
			tags: [],
		},
		mode: "onTouched",
	});
	const { addToast } = useToastsStore();
	const t = useTranslations();
	const [isLoading, setIsLoading] = useState(false);
	const { socket, connState } = useSocketStore();
	const [formDim, { width }] = useComponentDimensions<HTMLDivElement>();
	const tagsField = watch("tags");
	const isPrivate = watch("isPrivate");
	const description = watch("description");
	const router = useRouter();

	const insertNewTag = () => {
		setValue(`tags.${tagsField.length}`, "");
	};

	const deleteTag = (idx: number) => {
		setValue(
			"tags",
			tagsField.filter((_, _idx) => idx !== _idx)
		);
	};

	const onPrivacyChange = (value: LiteralUnion<"public" | "private">) => {
		if (value === "private") return setValue("isPrivate", true);
		return setValue("isPrivate", false);
	};

	const onSubmit = (d: FormData) => {
		socket?.sendJson({ action: "@room:create", payload: d });
		setIsLoading(true);
	};

	useEffect(() => {
		return () => {
			reset();
			setIsLoading(false);
		};
	}, [open]);

	useEffect(() => {
		socket?.on("@room:created", ({ roomId }) => {
			setIsLoading(false);
			router.push(ROUTES.ROOM(roomId));
		});

		socket?.on("@room:create-error", () => {
			setIsLoading(false);
			addToast({
				title: "There's been an err while creating the room, try again",
				timerInMs: 2000,
			});
		});

		return () => {
			socket?.removeEventListener("@room:created");
			socket?.removeEventListener("@room:create-error");
		};
	}, [socket]);

	return (
		<Modal open={open} setOpen={setOpen} showCloseButton shouldCloseOnEsc={false}>
			<ModalForm
				title={t("feed.create-room-form.title")}
				description={t("feed.create-room-form.description")}
				btnText={t("feed.create-room-btn")}
				cancelBtnText={t("forms.cancel")}
				showCancelBtn
				onSubmit={handleSubmit(onSubmit)}
				setOpen={setOpen}
				disabled={!formState.isValid}
				isLoading={isLoading || connState === "loading" || connState === "idle"}
				classNames={{
					container: "max-mobile:w-[90vw] w-[600px]",
				}}
			>
				<div className="flex w-full flex-col gap-5">
					<div
						ref={formDim}
						className="only-small-mobile:flex-col flex  w-full items-stretch gap-7"
					>
						<div className="only-small-mobile:w-full w-[65%]">
							<Input
								placeholder={t("feed.create-room-form.name-placeholder")}
								variant="secondary"
								{...register("name", { required: { value: true, message: "" } })}
								error={!!formState.errors.name}
								autoFocus
							/>
						</div>
						<div className="flex-1">
							<Select
								showArrow
								matchOptionsWidth
								onChange={onPrivacyChange}
								options={[
									{
										isSelected: !isPrivate,
										value: "public",
										text: t("feed.create-room-form.selector.public"),
									},
									{
										isSelected: isPrivate,
										value: "private",
										text: t("feed.create-room-form.selector.private"),
									},
								]}
								classNames={{
									container: "w-full h-full",
									select: "!w-full h-full",
								}}
							/>
						</div>
					</div>
					<Input
						placeholder={t("feed.create-room-form.description-placeholder")}
						variant="secondary"
						textArea={{ rows: 5 }}
						error={formState.errors.description?.message}
						isError={!!formState.errors.description}
						value={description}
						{...register("description", {
							required: {
								value: true,
								message: "",
							},
						})}
					/>
					<div className="flex w-full flex-col items-center gap-2">
						<div className="flex w-full flex-wrap justify-start gap-2">
							{tagsField.map((_, idx) => (
								<Input
									prefix="#"
									variant="primary"
									className="min-w-[50px] border-none"
									style={{ maxWidth: width }}
									adjustWidthToText
									value={tagsField[idx]}
									max={100}
									RightButton={
										<CrossIcon
											width={12}
											onClick={() => deleteTag(idx)}
											className="cursor-pointer opacity-0 group-hover:opacity-100"
										/>
									}
									autoFocus
									{...register(`tags.${idx}`)}
								/>
							))}
						</div>
						<Button variant="text" onClick={insertNewTag}>
							+ {t("feed.create-room-form.add-tag")}
						</Button>
					</div>
				</div>
			</ModalForm>
		</Modal>
	);
};
