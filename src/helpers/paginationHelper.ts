

const pagination = (payload: Record<string, any>) => {
    const orderBy = payload.orderBy;
    const page = Number(payload.page) || 1;
    const limit = Number(payload.limit) || 10;
    const skip = (page - 1) * limit;
    return { skip, take: limit, orderBy };
};


export default pagination;