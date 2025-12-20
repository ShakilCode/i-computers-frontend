export default function Card(props){
    return(
        <div className={"w-[200px] h-[300px] m-4 p-4 rounded-lg shadow-lg"}
        style={
            {
                background : props.color
            }
        }>
    </div>
    )
}