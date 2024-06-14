import { Card, Modal, SocialLink } from "@glimmer/ui/web";
import { useGetUser } from "apps/dostoevsky/src/hooks/useGetUser";
import { useRouting } from "apps/dostoevsky/src/hooks/useRouting";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

type Props = {
	id: string;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
};

export const UserProfile: React.FC<Props> = ({ open, setOpen, id }) => {
	const { data, isLoading } = useGetUser(id);
	const { openWindowAt } = useRouting();

	return (
		<Modal
			open={open}
			setOpen={setOpen}
			showCloseButton
			shouldCloseOnEsc
			shouldCloseOnOutsideClick
		>
			<Card className="w-[350px] p-10 py-[60px]">
				{!data || isLoading ? (
					<h5>Loading...</h5>
				) : (
					<div className="flex flex-col items-center justify-center">
						<div className="mb-3 flex flex-col items-center">
							<Image
								src={data.image}
								alt="user-img"
								width={50}
								height={50}
								className="rounded-full"
							/>
							<h5>{data.name}</h5>
						</div>
						<p className="mb-8 text-center">{data.description}</p>
						<div className="flex flex-wrap items-center justify-center gap-5">
							{data.links.map((link, idx) => (
								<SocialLink
									key={idx}
									{...link}
									href={link.url}
									onClick={openWindowAt(link.url)}
								/>
							))}
						</div>
					</div>
				)}
			</Card>
		</Modal>
	);
};
