package com.chirui.data.db.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.chirui.data.db.entity.ReadingHistoryEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ReadingHistoryDao {

    @Query(
        """
        SELECT * FROM reading_history
        ORDER BY last_read_at DESC
        """
    )
    fun observeHistory(): Flow<List<ReadingHistoryEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(entry: ReadingHistoryEntity): Long

    @Query("DELETE FROM reading_history WHERE id = :id")
    suspend fun deleteById(id: Long)

    @Query("DELETE FROM reading_history")
    suspend fun clear()
}
