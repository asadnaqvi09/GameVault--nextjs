
export const getAllGenre = (req,res) => {
    res.status(200).json({
        success: true,
        message: 'Get All Genre',
    })
}

export const addGenre = (req,res) => {
    res.status(200).json({
        success: true,
        message: 'Add Genre',
    })
}

export const updateGenre = (req,res) => {
    res.status(200).json({
        success: true,
        message: 'Update Genre',
    })
}

export const deleteGenre = (req,res) => {
    res.status(200).json({
        success: true,
        message: 'Delete Genre',
    })
}