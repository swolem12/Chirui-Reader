package com.chirui.domain.reader

import com.chirui.domain.model.ReaderChapter

interface ReaderRepository {
    suspend fun loadChapter(chapterId: String): ReaderChapter?
}
