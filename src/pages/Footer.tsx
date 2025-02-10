export default function Footer() {
    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", zIndex: "+Infinity" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "2vh", color: "#4F6BFE", fontWeight: "650", lineHeight: "3vh" }}>
                由&nbsp;<img src="/deepseek.jpg" style={{ height: "3vh" }}></img><span>&nbsp;R1模型赋能</span>
            </div>
            <div style={{ fontSize: "1.5vh",  fontWeight: "500"}}>研发单位: 三营</div>
            <div style={{ height: "1vh", width: "100%",}}></div>
        </div>
    );
}
