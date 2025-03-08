export const login = async (username, password) => {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token); // Salva o token para próximas requisições
            return { success: true, token: data.token };
        } else {
            return { success: false, error: data.detail || "Erro ao autenticar" };
        }
    } catch (error) {
        return { success: false, error: "Erro de conexão" };
    }
};
