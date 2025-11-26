package com.chirui.data.db.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.chirui.data.db.entity.LibraryMangaEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface LibraryMangaDao {

    @Query("SELECT * FROM library_manga ORDER BY in_library_since DESC")
    fun observeAll(): Flow<List<LibraryMangaEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(manga: LibraryMangaEntity): Long

    @Delete
    suspend fun delete(manga: LibraryMangaEntity)

    @Query("DELETE FROM library_manga")
    suspend fun clear()
}
