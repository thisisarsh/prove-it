interface ErrorMessageProps {
    message: string;
}

export default function ErrorMessageContainer(props: ErrorMessageProps) {
    return <div className="error">{props.message}</div>;
}
